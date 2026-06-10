export type StyleCategory =
  | 'Prompt'
  | 'BD & Illustration'
  | 'Anime & Manga'
  | 'Art traditionnel'
  | 'Photo & Cinema'
  | 'Gaming'
  | 'Fun & Viral';

export type GenerationMode = 'fast' | 'quality';

export type AiProvider = 'mock' | 'openai' | 'fal';

export type StyleMode = 'prompt-only' | 'styled';

export interface ArtStyle {
  id: string;
  name: string;
  category: StyleCategory;
  accent: string;
  prompt: string;
  description: string;
  tags: string[];
  mode: StyleMode;
}

export interface PreservationSettings {
  subject: boolean;
  face: boolean;
  clothing: boolean;
  pose: boolean;
  background: boolean;
}

export interface GenerationSettings {
  provider: AiProvider;
  intensity: number;
  faceFidelity: number;
  styleStrength: number;
  creativity: number;
  mode: GenerationMode;
  customPrompt: string;
  preserve: PreservationSettings;
}

export interface Creation {
  id: string;
  sourceUrl: string;
  resultUrl: string;
  styleId: string;
  styleName: string;
  createdAt: number;
  favorite: boolean;
}

export interface SourcePhoto {
  id: string;
  dataUrl: string;
  createdAt: number;
  label: string;
}

export interface CropState {
  zoom: number;
  centerX: number;
  centerY: number;
}

export interface GenerateImageInput {
  imageDataUrl: string;
  style: ArtStyle;
  settings: GenerationSettings;
  variationPrompt?: string;
  signal?: AbortSignal;
  onProgress?: (progress: number, message: string) => void;
}

export interface GenerateImageResult {
  imageDataUrl: string;
  provider: AiProvider;
}

export interface StyleRecommendation {
  style: ArtStyle;
  reason: string;
}

export interface ImageProfile {
  orientation: 'portrait' | 'landscape' | 'square';
  brightness: 'dark' | 'balanced' | 'bright';
  contrast: 'soft' | 'medium' | 'high';
  colorfulness: 'muted' | 'balanced' | 'vivid';
}

export interface QuickVariation {
  id: string;
  label: string;
  prompt: string;
}
