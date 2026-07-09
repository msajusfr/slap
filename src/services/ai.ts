import type { ArtStyle, GenerateImageInput, GenerateImageResult } from '../types';

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const OPENAI_IMAGE_ENDPOINT = '/api/openai-image';
const FAL_IMAGE_ENDPOINT = '/api/fal-image';

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageResult> {
  const provider = input.settings.provider;

  if (provider === 'openai') {
    return generateWithOpenAi(input);
  }

  if (provider === 'fal') {
    return generateWithFal(input);
  }

  return generateWithMockProvider(input);
}

async function generateWithMockProvider(input: GenerateImageInput): Promise<GenerateImageResult> {
  const steps = [
    'Analyse de la photo',
    'Composition du prompt',
    'Application du style',
    'Finalisation HD'
  ];

  for (let index = 0; index < steps.length; index += 1) {
    input.signal?.throwIfAborted();
    input.onProgress?.((index + 1) / (steps.length + 1), steps[index]);
    await sleep(input.settings.mode === 'fast' ? 280 : 520);
  }

  const imageDataUrl = await renderStyledPreview(input);
  input.onProgress?.(1, 'Pret');

  return {
    imageDataUrl,
    provider: 'mock'
  };
}

async function generateWithOpenAi(input: GenerateImageInput): Promise<GenerateImageResult> {
  input.onProgress?.(0.15, 'Preparation OpenAI');
  const imageBlob = await dataUrlToBlob(input.imageDataUrl);
  const formData = new FormData();
  const prompt = buildGenerationPrompt(input);

  formData.append('image', imageBlob, 'source.jpg');
  formData.append('prompt', prompt);
  formData.append('mode', input.settings.mode);
  formData.append('surfaceOnly', String(input.settings.preserve.subject));

  input.onProgress?.(0.35, 'Envoi securise');
  const response = await fetch(OPENAI_IMAGE_ENDPOINT, {
    method: 'POST',
    body: formData,
    signal: input.signal
  });

  input.onProgress?.(0.72, 'Reception du rendu');
  const payload = (await response.json().catch(() => null)) as ImageProxyResponse | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? `La fonction OpenAI a renvoye une erreur HTTP ${response.status}.`);
  }

  if (!payload?.imageDataUrl) {
    throw new Error('La fonction OpenAI n a pas renvoye d image exploitable.');
  }

  input.onProgress?.(1, 'Pret');

  return {
    imageDataUrl: payload.imageDataUrl,
    provider: 'openai'
  };
}

async function generateWithFal(input: GenerateImageInput): Promise<GenerateImageResult> {
  input.onProgress?.(0.15, 'Preparation fal.ai');
  const imageBlob = await dataUrlToBlob(input.imageDataUrl);
  const formData = new FormData();
  const prompt = buildGenerationPrompt(input);

  formData.append('image', imageBlob, 'source.jpg');
  formData.append('prompt', prompt);
  formData.append('mode', input.settings.mode);
  formData.append('intensity', String(input.settings.intensity));
  formData.append('styleStrength', String(input.settings.styleStrength));
  formData.append('surfaceOnly', String(input.settings.preserve.subject));

  input.onProgress?.(0.35, 'Envoi securise');
  const response = await fetch(FAL_IMAGE_ENDPOINT, {
    method: 'POST',
    body: formData,
    signal: input.signal
  });

  input.onProgress?.(0.72, 'Reception du rendu');
  const payload = (await response.json().catch(() => null)) as ImageProxyResponse | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? `La fonction fal.ai a renvoye une erreur HTTP ${response.status}.`);
  }

  if (!payload?.imageDataUrl) {
    throw new Error('La fonction fal.ai n a pas renvoye d image exploitable.');
  }

  input.onProgress?.(1, 'Pret');

  return {
    imageDataUrl: payload.imageDataUrl,
    provider: 'fal'
  };
}

async function renderStyledPreview(input: GenerateImageInput): Promise<string> {
  const source = await loadImage(input.imageDataUrl);
  const canvas = document.createElement('canvas');
  const size = Math.min(1400, Math.max(source.width, source.height));
  const ratio = source.width / source.height;
  canvas.width = ratio >= 1 ? size : Math.round(size * ratio);
  canvas.height = ratio >= 1 ? Math.round(size / ratio) : size;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas indisponible sur ce navigateur.');
  }

  const intensity = input.settings.intensity / 100;
  context.filter = buildCanvasFilter(input.style.id, intensity);
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  context.filter = 'none';

  drawStyleOverlay(context, canvas.width, canvas.height, input.style.accent, intensity);
  drawSignature(context, canvas.width, canvas.height, input.style.name);

  return canvas.toDataURL('image/jpeg', input.settings.mode === 'quality' ? 0.94 : 0.86);
}

interface ImageProxyResponse {
  imageDataUrl?: string;
  error?: string;
}

function buildGenerationPrompt(input: GenerateImageInput) {
  const fidelity = input.settings.intensity >= 78 ? 'forte' : input.settings.intensity >= 48 ? 'equilibree' : 'subtile';
  const customPrompt = input.settings.customPrompt.trim();

  if (input.style.mode === 'prompt-only') {
    if (!customPrompt) {
      throw new Error('Ajoutez un prompt avance pour utiliser Prompt only.');
    }

    return [
      'Modifie cette image source en suivant uniquement la demande utilisateur.',
      'N applique aucun style artistique implicite, preset, filtre, rendu BD, manga, illustration ou cinema non demande explicitement.',
      'Si l image source porte deja un style visuel precedent, considere-le comme un artefact a neutraliser sauf si la demande utilisateur le mentionne.',
      'Utilise l image source comme reference de contenu, de sujet et de composition, pas comme instruction de style.',
      'Preserve les sujets et la composition qui ne sont pas explicitement modifies.',
      `Demande utilisateur: ${customPrompt}`,
      `Intensite de modification: ${fidelity} (${input.settings.intensity}%).`,
      `Fidelite au visage: ${input.settings.faceFidelity}%.`,
      `Force du style: ${input.settings.styleStrength}%.`,
      `Creativite: ${input.settings.creativity}%.`,
      buildSurfaceOnlyPrompt(input.settings),
      buildFaceFidelityPrompt(input.settings),
      buildPreservationPrompt(input.settings),
      input.variationPrompt ? `Variation rapide demandee: ${input.variationPrompt}` : '',
      'Rendu final premium, propre, sans texte ajoute, sans watermark, pret au partage mobile.'
    ].filter(Boolean).join('\n');
  }

  return [
    'Transforme cette photo source en une nouvelle image stylisee.',
    `STYLE PRIORITAIRE A CONSERVER: ${input.style.name}.`,
    `Instruction de style prioritaire: ${input.style.prompt}`,
    'Toutes les autres instructions sont secondaires: elles doivent soutenir ce style, jamais le remplacer par un autre rendu.',
    'Conserve la composition principale, les sujets importants et une ressemblance naturelle sans neutraliser le style choisi.',
    `Intensite stylistique: ${fidelity} (${input.settings.intensity}%).`,
    `Fidelite au visage: ${input.settings.faceFidelity}%.`,
    `Force du style: ${input.settings.styleStrength}%.`,
    `Creativite: ${input.settings.creativity}%.`,
    buildSurfaceOnlyPrompt(input.settings, input.style),
    buildFaceFidelityPrompt(input.settings),
    buildPreservationPrompt(input.settings),
    customPrompt ? buildSecondaryDirectionPrompt('Direction supplementaire utilisateur', customPrompt, input.style) : '',
    input.variationPrompt ? buildSecondaryDirectionPrompt('Variation rapide demandee', input.variationPrompt, input.style) : '',
    'Rendu final premium, propre, sans texte ajoute, sans watermark, pret au partage mobile.'
  ]
    .filter(Boolean)
    .join('\n');
}

function buildPreservationPrompt(settings: GenerateImageInput['settings']) {
  const rules = [
    settings.preserve.subject ? 'verrouiller le sujet complet, sa morphologie, son age, son expression, ses traits distinctifs et son identite' : '',
    settings.preserve.face ? 'conserver le visage et l identite selon le niveau de fidelite demande' : '',
    settings.preserve.clothing ? 'conserver les vetements principaux' : '',
    settings.preserve.pose ? 'conserver la pose et le cadrage corporel' : '',
    settings.preserve.background ? 'conserver l arriere-plan autant que possible' : ''
  ].filter(Boolean);

  return rules.length > 0 ? `Contraintes de preservation: ${rules.join(', ')}.` : '';
}

function buildFaceFidelityPrompt(settings: GenerateImageInput['settings']) {
  if (!settings.preserve.face && !settings.preserve.subject) {
    return '';
  }

  if (settings.faceFidelity >= 92) {
    return [
      'Fidelite visage tres stricte:',
      'garde exactement la geometrie du visage, distance entre les yeux, forme du nez, bouche, machoire, expression, age apparent, peau, cheveux et signes distinctifs.',
      'Aucun embellissement, maquillage, lissage excessif, rajeunissement ou changement de personne.'
    ].join(' ');
  }

  if (settings.faceFidelity >= 65) {
    return 'Fidelite visage forte: preserve clairement l identite, les proportions du visage, l expression et les traits distinctifs tout en acceptant le rendu graphique du style.';
  }

  return 'Fidelite visage souple: conserve une ressemblance generale du visage sans bloquer toutes les interpretations artistiques.';
}

function buildSecondaryDirectionPrompt(label: string, prompt: string, style: ArtStyle) {
  return `${label}: ${prompt} Applique cette demande uniquement si elle reste compatible avec le style ${style.name}.`;
}

function buildSurfaceOnlyPrompt(settings: GenerateImageInput['settings'], style?: ArtStyle) {
  if (!settings.preserve.subject) {
    return '';
  }

  const styleLabel = style ? `le style ${style.name}` : 'le style choisi';
  const stylePrompt = style ? `Directive du style a garder visible: ${style.prompt}` : '';

  return [
    'MODE SUJET INTACT / IDENTITY-LOCKED STYLE TRANSFER.',
    'Le personnage doit rester exactement le meme: meme geometrie du visage, memes yeux, nez, bouche, expression, age, morphologie, cheveux, vetements et pose.',
    'Ne remplace pas la personne, ne l embellis pas, ne la maquille pas, ne change pas ses traits et ne redesign pas son corps.',
    `Applique ${styleLabel} de facon visible comme couche de rendu: traits, contours, texture, lumiere, couleur, contraste, grain et ambiance propres a ce style.`,
    stylePrompt,
    'N introduis pas un autre medium ou une autre direction artistique sauf si le style prioritaire le demande explicitement.',
    'Le resultat doit etre reconnu immediatement comme la meme photo et le meme personnage, seulement rendu dans le style prioritaire.'
  ].join(' ');
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image invalide.'));
    image.src = dataUrl;
  });
}

function buildCanvasFilter(styleId: string, intensity: number) {
  const boost = Math.round(100 + intensity * 44);
  const contrast = Math.round(100 + intensity * 30);
  const saturate = Math.round(styleId.includes('bw') || styleId.includes('manga') ? 10 : 115 + intensity * 70);

  if (styleId.includes('crayon') || styleId.includes('fusain')) {
    return `grayscale(${Math.round(80 + intensity * 20)}%) contrast(${contrast + 22}%) brightness(${105 - intensity * 8}%)`;
  }

  if (styleId.includes('argentique')) {
    return `sepia(${Math.round(18 + intensity * 22)}%) contrast(${contrast}%) saturate(${105 + intensity * 24}%)`;
  }

  if (styleId.includes('cyberpunk')) {
    return `contrast(${contrast + 18}%) saturate(${saturate + 40}%) hue-rotate(${Math.round(12 + intensity * 18)}deg)`;
  }

  return `contrast(${contrast}%) saturate(${saturate}%) brightness(${boost}%)`;
}

function drawStyleOverlay(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  accent: string,
  intensity: number
) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `${accent}22`);
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.02)');
  gradient.addColorStop(1, 'rgba(10,12,28,0.26)');
  context.globalCompositeOperation = 'soft-light';
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.globalCompositeOperation = 'overlay';
  context.strokeStyle = `${accent}${Math.round(35 + intensity * 80).toString(16).padStart(2, '0')}`;
  context.lineWidth = Math.max(2, Math.round(width * 0.004));
  const gap = Math.max(22, Math.round(width * 0.042));

  for (let x = -height; x < width; x += gap) {
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(x + height, 0);
    context.stroke();
  }

  context.globalCompositeOperation = 'source-over';
  context.fillStyle = 'rgba(255,255,255,0.035)';
  for (let y = 0; y < height; y += 3) {
    context.fillRect(0, y, width, 1);
  }
}

function drawSignature(context: CanvasRenderingContext2D, width: number, height: number, styleName: string) {
  const padding = Math.round(width * 0.035);
  context.fillStyle = 'rgba(7, 11, 24, 0.52)';
  context.fillRect(padding, height - padding * 2.7, Math.min(width * 0.48, 360), padding * 1.5);
  context.fillStyle = 'rgba(255,255,255,0.86)';
  context.font = `${Math.max(16, Math.round(width * 0.022))}px Inter, system-ui, sans-serif`;
  context.fillText(`Slap - ${styleName}`, padding * 1.35, height - padding * 1.65);
}
