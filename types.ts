
export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  modelImage: ImageData;
  outfitImage: ImageData;
  resultImage: ImageData;
  timestamp: number;
  prompt: string;
  productName?: string;
  price?: string;
  stylingAdvice?: string;
}

export type View = 'studio' | 'library' | 'strategy';
