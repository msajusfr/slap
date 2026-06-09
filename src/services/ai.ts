import type { GenerateImageInput, GenerateImageResult } from '../types';

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

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
  if (!input.settings.apiKey) {
    throw new Error('Ajoutez une cle API OpenAI dans les reglages.');
  }

  input.onProgress?.(0.15, 'Preparation OpenAI');
  throw new Error(
    'Le provider OpenAI est cable cote service mais necessite un relais serveur pour une utilisation production sans exposer la cle.'
  );
}

async function generateWithFal(input: GenerateImageInput): Promise<GenerateImageResult> {
  if (!input.settings.apiKey) {
    throw new Error('Ajoutez une cle API fal.ai dans les reglages.');
  }

  input.onProgress?.(0.15, 'Preparation fal.ai');
  throw new Error(
    'Le provider fal.ai est pret dans l architecture, mais doit etre branche a un endpoint modele autorise par votre cle.'
  );
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
