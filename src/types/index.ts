export type StyleCategory = 'Prompt' | 'Bande dessinee' | 'Dessin' | 'Modernes' | 'Photo premium' | 'Fun';

export type GenerationMode = 'fast' | 'quality';

export type AiProvider = 'mock' | 'openai' | 'fal';

export interface ArtStyle {
  id: string;
  name: string;
  category: StyleCategory;
  accent: string;
  prompt: string;
}

export interface GenerationSettings {
  provider: AiProvider;
  apiKey: string;
  intensity: number;
  mode: GenerationMode;
  customPrompt: string;
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

export interface GenerateImageInput {
  imageDataUrl: string;
  style: ArtStyle;
  settings: GenerationSettings;
  signal?: AbortSignal;
  onProgress?: (progress: number, message: string) => void;
}

export interface GenerateImageResult {
  imageDataUrl: string;
  provider: AiProvider;
}
