export type AspectRatio =
  | "auto"
  | "21:9"
  | "16:9"
  | "3:2"
  | "4:3"
  | "5:4"
  | "1:1"
  | "4:5"
  | "3:4"
  | "2:3"
  | "9:16";

export type Resolution = "0.5K" | "1K" | "2K" | "4K";

export type Category = "text-to-image" | "image-to-image" | "text-to-video" | "image-to-video";

export type OutputType = "image" | "video";

export interface ModelSettings {
  aspectRatio: string;
  resolution: string;
  imageSize?: string;
  duration: number;
  numOutputs: number;
  seed: number | null;
  steps?: number;
  guidanceScale?: number;
  cfgScale?: number;
  safetyTolerance?: string;
}

export interface GeneratedContent {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  settings: ModelSettings;
  fileName: string;
  width?: number;
  height?: number;
  cost: number;
  modelId: string;
  modelName: string;
  category: Category;
  outputType: OutputType;
  duration?: number;
  thumbnailUrl?: string;
}

export interface GenerationRequest {
  modelId: string;
  category: Category;
  prompt: string;
  referenceImages?: string[]; // Changed to array
  settings: ModelSettings;
}

export interface FalImageOutput {
  url: string;
  content_type: string;
  file_name: string;
  width?: number;
  height?: number;
}

export interface FalVideoOutput {
  url: string;
  content_type: string;
  file_name: string;
  duration?: number;
  thumbnail_url?: string;
}

export interface GenerationResponse {
  images?: FalImageOutput[];
  video?: FalVideoOutput;
  videos?: FalVideoOutput[];
  description?: string;
}

export type GenerationMode = "text-to-image" | "image-to-image";

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  resolution: Resolution;
  numImages: number;
  seed: number | null;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  settings: GenerationSettings;
  fileName: string;
  width?: number;
  height?: number;
  cost: number;
  model: string;
  mode: GenerationMode;
}

// Queue Types
export type QueueItemStatus = "pending" | "generating" | "completed" | "failed";

export interface QueueItem {
  id: string;
  modelId: string;
  modelName: string;
  category: Category;
  prompt: string;
  referenceImages?: string[]; // Changed to array
  settings: ModelSettings;
  status: QueueItemStatus;
  progress: number; // 0-100
  startTime: number | null;
  estimatedDuration: number; // in seconds
  error?: string;
  results?: GeneratedContent[];
  cost: number;
  apiKey: string;
}
