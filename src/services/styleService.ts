import { artStyles, categories } from '../data/styles';
import type { ArtStyle, ImageProfile, StyleCategory, StyleRecommendation } from '../types/style';

const legacyStyleIds: Record<string, string> = {
  'ligne-claire': 'ligne-claire-belge',
  'graphic-noir': 'roman-graphique-sombre',
  'manga-noir': 'manga-nb',
  crayon: 'crayon-graphite',
  huile: 'huile-classique',
  studio: 'cinematique',
  argentique: 'vintage-annees-70',
  'cinema-bw': 'film-noir',
  fashion: 'couverture-magazine',
  collectible: 'action-figure',
  pixel: 'starter-pack',
  kawaii: 'couverture-magazine',
  lego: 'action-figure'
};

export function getStyles() {
  return artStyles;
}

export function getCategories() {
  return categories;
}

export function getStyleById(styleId: string) {
  const migratedStyleId = legacyStyleIds[styleId] ?? styleId;
  return artStyles.find((style) => style.id === migratedStyleId) ?? artStyles[0];
}

export function filterStyles(options: {
  category: StyleCategory | 'Tous';
  query: string;
  favoriteStyleIds: string[];
  recentStyleIds: string[];
}) {
  const normalizedQuery = normalize(options.query);
  const visibleStyles = options.category === 'Tous'
    ? artStyles
    : artStyles.filter((style) => style.category === options.category);

  return visibleStyles.filter((style) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchable = normalize([
      style.name,
      style.category,
      style.description,
      style.prompt,
      ...style.tags
    ].join(' '));

    return searchable.includes(normalizedQuery);
  }).sort((left, right) => {
    const leftScore = getPersonalScore(left.id, options.favoriteStyleIds, options.recentStyleIds);
    const rightScore = getPersonalScore(right.id, options.favoriteStyleIds, options.recentStyleIds);
    return rightScore - leftScore;
  });
}

export function addRecentStyle(styleIds: string[], styleId: string) {
  return [styleId, ...styleIds.filter((currentId) => currentId !== styleId)].slice(0, 8);
}

export function toggleFavoriteStyle(styleIds: string[], styleId: string) {
  return styleIds.includes(styleId)
    ? styleIds.filter((currentId) => currentId !== styleId)
    : [styleId, ...styleIds];
}

export async function analyzeImage(imageDataUrl: string): Promise<ImageProfile> {
  const image = await loadImage(imageDataUrl);
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Analyse image indisponible sur ce navigateur.');
  }

  context.drawImage(image, 0, 0, size, size);
  const data = context.getImageData(0, 0, size, size).data;
  let brightnessTotal = 0;
  let colorTotal = 0;
  let minBrightness = 255;
  let maxBrightness = 0;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const brightness = (red + green + blue) / 3;
    brightnessTotal += brightness;
    colorTotal += Math.max(red, green, blue) - Math.min(red, green, blue);
    minBrightness = Math.min(minBrightness, brightness);
    maxBrightness = Math.max(maxBrightness, brightness);
  }

  const pixels = data.length / 4;
  const averageBrightness = brightnessTotal / pixels;
  const averageColor = colorTotal / pixels;
  const contrastRange = maxBrightness - minBrightness;

  return {
    orientation: getOrientation(image.width, image.height),
    brightness: averageBrightness < 88 ? 'dark' : averageBrightness > 176 ? 'bright' : 'balanced',
    contrast: contrastRange < 92 ? 'soft' : contrastRange > 176 ? 'high' : 'medium',
    colorfulness: averageColor < 32 ? 'muted' : averageColor > 82 ? 'vivid' : 'balanced'
  };
}

export async function recommendStyles(imageDataUrl: string): Promise<StyleRecommendation[]> {
  const profile = await analyzeImage(imageDataUrl);
  const scoredStyles = artStyles
    .filter((style) => style.mode !== 'prompt-only')
    .map((style) => ({
      style,
      score: scoreStyle(style, profile),
      reason: buildReason(style, profile)
    }))
    .sort((left, right) => right.score - left.score);

  return scoredStyles.slice(0, 3).map(({ style, reason }) => ({ style, reason }));
}

function scoreStyle(style: ArtStyle, profile: ImageProfile) {
  let score = 0;
  const tagText = normalize(style.tags.join(' '));

  if (profile.orientation === 'portrait' && tagText.includes('portrait')) {
    score += 3;
  }

  if (profile.brightness === 'dark' && (tagText.includes('sombre') || tagText.includes('noir'))) {
    score += 4;
  }

  if (profile.brightness === 'bright' && (tagText.includes('clair') || tagText.includes('lumineux') || tagText.includes('doux'))) {
    score += 3;
  }

  if (profile.contrast === 'high' && (tagText.includes('cinema') || tagText.includes('comics') || tagText.includes('noir blanc'))) {
    score += 3;
  }

  if (profile.colorfulness === 'vivid' && (tagText.includes('anime') || tagText.includes('cyberpunk') || tagText.includes('comics'))) {
    score += 4;
  }

  if (profile.colorfulness === 'muted' && (tagText.includes('photo') || tagText.includes('dessin') || tagText.includes('retro'))) {
    score += 2;
  }

  return score + Math.max(0, 3 - categories.indexOf(style.category));
}

function buildReason(style: ArtStyle, profile: ImageProfile) {
  const imageTrait = [
    profile.orientation === 'portrait' ? 'le cadrage portrait' : 'la composition',
    profile.brightness === 'dark' ? 'l eclairage sombre' : profile.brightness === 'bright' ? 'la lumiere claire' : 'l eclairage equilibre',
    profile.colorfulness === 'vivid' ? 'les couleurs marquees' : profile.colorfulness === 'muted' ? 'la palette douce' : 'les couleurs equilibrees'
  ].join(', ');

  return `${imageTrait} conviennent bien au style ${style.name}.`;
}

function getPersonalScore(styleId: string, favoriteStyleIds: string[], recentStyleIds: string[]) {
  const recentIndex = recentStyleIds.indexOf(styleId);
  return (favoriteStyleIds.includes(styleId) ? 10 : 0) + (recentIndex >= 0 ? Math.max(0, 8 - recentIndex) : 0);
}

function getOrientation(width: number, height: number): ImageProfile['orientation'] {
  const ratio = width / height;

  if (ratio > 1.18) {
    return 'landscape';
  }

  if (ratio < 0.86) {
    return 'portrait';
  }

  return 'square';
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image invalide.'));
    image.src = dataUrl;
  });
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
