export type Category = "text-to-image" | "image-to-image" | "text-to-video" | "image-to-video";

export interface ModelConfig {
  id: string;
  name: string;
  category: Category;
  costPerUnit: number;
  unit: "image" | "video";
  description?: string;
  supportsMultipleImages?: boolean;
  params: {
    aspectRatio: boolean;
    resolution: boolean;
    imageSize?: boolean;
    duration: boolean;
    numOutputs: boolean;
    seed: boolean;
    steps?: boolean;
    guidanceScale?: boolean;
    cfgScale?: boolean;
    safetyTolerance?: boolean;
  };
  defaults: {
    aspectRatio?: string;
    resolution?: string;
    imageSize?: string;
    duration?: number;
    numOutputs: number;
    seed?: number;
    steps?: number;
    guidanceScale?: number;
    cfgScale?: number;
    safetyTolerance?: string;
  };
  aspectRatioOptions?: string[];
  resolutionOptions?: string[];
  imageSizeOptions?: string[];
  durationOptions?: number[];
}

export const DEFAULT_ASPECT_RATIOS = ["auto", "21:9", "16:9", "3:2", "4:3", "5:4", "1:1", "4:5", "3:4", "2:3", "9:16"];
export const DEFAULT_RESOLUTIONS = ["0.5K", "1K", "2K", "4K"];
export const DEFAULT_DURATIONS = [5, 8];
export const VIDEO_RESOLUTIONS = ["720p", "1080p", "4k"];

export const MODELS: Record<string, ModelConfig> = {
  "fal-ai/nano-banana-2": {
    id: "fal-ai/nano-banana-2",
    name: "Nano Banana 2",
    category: "text-to-image",
    costPerUnit: 0.039,
    unit: "image",
    description: "Fast and efficient text-to-image generation",
    params: {
      aspectRatio: true,
      resolution: true,
      duration: false,
      numOutputs: true,
      seed: true,
      steps: false,
      guidanceScale: false,
    },
    defaults: {
      aspectRatio: "auto",
      resolution: "1K",
      numOutputs: 1,
    },
    aspectRatioOptions: DEFAULT_ASPECT_RATIOS,
    resolutionOptions: DEFAULT_RESOLUTIONS,
  },
  "fal-ai/bytedance/seedream/v4.5/text-to-image": {
    id: "fal-ai/bytedance/seedream/v4.5/text-to-image",
    name: "SeeDream V4.5",
    category: "text-to-image",
    costPerUnit: 0.02,
    unit: "image",
    description: "High-quality text-to-image generation",
    params: {
      aspectRatio: false,
      resolution: false,
      imageSize: true,
      duration: false,
      numOutputs: true,
      seed: true,
    },
    defaults: {
      imageSize: "auto_2K",
      numOutputs: 1,
    },
    imageSizeOptions: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9", "auto_2K", "auto_4K"],
  },
  "fal-ai/nano-banana-2/edit": {
    id: "fal-ai/nano-banana-2/edit",
    name: "Nano Banana 2 Edit",
    category: "image-to-image",
    costPerUnit: 0.039,
    unit: "image",
    description: "Fast image editing with multiple reference support (4x faster)",
    supportsMultipleImages: true,
    params: {
      aspectRatio: true,
      resolution: true,
      duration: false,
      numOutputs: true,
      seed: true,
      steps: false,
      guidanceScale: false,
    },
    defaults: {
      aspectRatio: "auto",
      resolution: "1K",
      numOutputs: 1,
    },
    aspectRatioOptions: DEFAULT_ASPECT_RATIOS,
    resolutionOptions: DEFAULT_RESOLUTIONS,
  },
  "fal-ai/nano-banana-pro/edit": {
    id: "fal-ai/nano-banana-pro/edit",
    name: "Nano Banana Pro Edit",
    category: "image-to-image",
    costPerUnit: 0.05,
    unit: "image",
    description: "Pro image editing with multiple reference support",
    supportsMultipleImages: true,
    params: {
      aspectRatio: true,
      resolution: true,
      duration: false,
      numOutputs: true,
      seed: true,
      steps: false,
      guidanceScale: false,
    },
    defaults: {
      aspectRatio: "auto",
      resolution: "1K",
      numOutputs: 1,
    },
    aspectRatioOptions: DEFAULT_ASPECT_RATIOS,
    resolutionOptions: ["1K", "2K", "4K"],
  },
  "fal-ai/bytedance/seedream/v4.5/edit": {
    id: "fal-ai/bytedance/seedream/v4.5/edit",
    name: "SeeDream V4.5 Edit",
    category: "image-to-image",
    costPerUnit: 0.02,
    unit: "image",
    description: "Edit images with SeeDream V4.5",
    params: {
      aspectRatio: false,
      resolution: false,
      imageSize: true,
      duration: false,
      numOutputs: true,
      seed: true,
    },
    defaults: {
      imageSize: "auto_2K",
      numOutputs: 1,
    },
    imageSizeOptions: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9", "auto_2K", "auto_4K"],
  },
  "fal-ai/bytedance/seedream/v5/lite/edit": {
    id: "fal-ai/bytedance/seedream/v5/lite/edit",
    name: "SeeDream V5 Lite Edit",
    category: "image-to-image",
    costPerUnit: 0.015,
    unit: "image",
    description: "Fast image editing with SeeDream V5 Lite",
    params: {
      aspectRatio: false,
      resolution: false,
      imageSize: true,
      duration: false,
      numOutputs: true,
      seed: true,
    },
    defaults: {
      imageSize: "auto_2K",
      numOutputs: 1,
    },
    imageSizeOptions: ["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9", "auto_2K", "auto_3K"],
  },
  "fal-ai/veo3.1": {
    id: "fal-ai/veo3.1",
    name: "Veo 3.1",
    category: "text-to-video",
    costPerUnit: 0.2,
    unit: "video",
    description: "High-quality video generation from text",
    params: {
      aspectRatio: true,
      resolution: true,
      duration: true,
      numOutputs: false,
      seed: true,
      safetyTolerance: true,
    },
    defaults: {
      aspectRatio: "16:9",
      resolution: "720p",
      duration: 8,
      numOutputs: 1,
      seed: undefined,
      safetyTolerance: "2",
    },
    aspectRatioOptions: ["16:9", "9:16"],
    resolutionOptions: ["720p", "1080p", "4k"],
    durationOptions: [4, 6, 8],
  },
  "fal-ai/veo3.1/fast": {
    id: "fal-ai/veo3.1/fast",
    name: "Veo 3.1 Fast",
    category: "text-to-video",
    costPerUnit: 0.1,
    unit: "video",
    description: "Fast video generation from text",
    params: {
      aspectRatio: true,
      resolution: true,
      duration: true,
      numOutputs: false,
      seed: true,
      safetyTolerance: true,
    },
    defaults: {
      aspectRatio: "16:9",
      resolution: "720p",
      duration: 8,
      numOutputs: 1,
      seed: undefined,
      safetyTolerance: "2",
    },
    aspectRatioOptions: ["16:9", "9:16"],
    resolutionOptions: ["720p", "1080p", "4k"],
    durationOptions: [4, 6, 8],
  },
  "fal-ai/veo3.1/image-to-video": {
    id: "fal-ai/veo3.1/image-to-video",
    name: "Veo 3.1",
    category: "image-to-video",
    costPerUnit: 0.2,
    unit: "video",
    description: "Animate images into videos",
    params: {
      aspectRatio: true,
      resolution: true,
      duration: true,
      numOutputs: false,
      seed: true,
    },
    defaults: {
      aspectRatio: "auto",
      resolution: "720p",
      duration: 8,
      numOutputs: 1,
      seed: undefined,
    },
    aspectRatioOptions: ["auto", "16:9", "9:16"],
    resolutionOptions: ["720p", "1080p", "4k"],
    durationOptions: [4, 6, 8],
  },
  "fal-ai/veo3.1/fast/image-to-video": {
    id: "fal-ai/veo3.1/fast/image-to-video",
    name: "Veo 3.1 Fast",
    category: "image-to-video",
    costPerUnit: 0.1,
    unit: "video",
    description: "Fast image animation to video",
    params: {
      aspectRatio: true,
      resolution: true,
      duration: true,
      numOutputs: false,
      seed: true,
    },
    defaults: {
      aspectRatio: "auto",
      resolution: "720p",
      duration: 8,
      numOutputs: 1,
      seed: undefined,
    },
    aspectRatioOptions: ["auto", "16:9", "9:16"],
    resolutionOptions: ["720p", "1080p", "4k"],
    durationOptions: [4, 6, 8],
  },
  "fal-ai/kling-video/v2.5-turbo/pro/image-to-video": {
    id: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
    name: "Kling V2.5 Turbo Pro",
    category: "image-to-video",
    costPerUnit: 0.12,
    unit: "video",
    description: "Professional image animation with Kling V2.5 Turbo",
    params: {
      aspectRatio: false,
      resolution: false,
      duration: true,
      numOutputs: false,
      seed: false,
      cfgScale: true,
    },
    defaults: {
      duration: 5,
      numOutputs: 1,
      cfgScale: 0.5,
    },
    durationOptions: [5, 10],
  },
  "fal-ai/kling-video/v2.6/pro/image-to-video": {
    id: "fal-ai/kling-video/v2.6/pro/image-to-video",
    name: "Kling V2.6 Pro",
    category: "image-to-video",
    costPerUnit: 0.15,
    unit: "video",
    description: "Professional image animation with Kling V2.6",
    params: {
      aspectRatio: false,
      resolution: false,
      duration: true,
      numOutputs: false,
      seed: false,
    },
    defaults: {
      duration: 5,
      numOutputs: 1,
    },
    durationOptions: [5, 10],
  },
  "fal-ai/kling-video/v3/pro/image-to-video": {
    id: "fal-ai/kling-video/v3/pro/image-to-video",
    name: "Kling V3 Pro",
    category: "image-to-video",
    costPerUnit: 0.18,
    unit: "video",
    description: "Professional image animation with Kling V3 (supports multiple images)",
    supportsMultipleImages: true,
    params: {
      aspectRatio: true,
      resolution: false,
      duration: true,
      numOutputs: false,
      seed: false,
      cfgScale: true,
    },
    defaults: {
      aspectRatio: "16:9",
      duration: 5,
      numOutputs: 1,
      cfgScale: 0.5,
    },
    aspectRatioOptions: ["16:9", "9:16", "1:1"],
    durationOptions: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
};

export function getModelsByCategory(category: Category): ModelConfig[] {
  return Object.values(MODELS).filter((model) => model.category === category);
}

export function getModelById(id: string): ModelConfig | undefined {
  return MODELS[id];
}

export function getDefaultModel(category: Category): ModelConfig {
  const models = getModelsByCategory(category);
  if (models.length === 0) {
    throw new Error(`No models found for category: ${category}`);
  }
  return models[0];
}

export function calculateCost(modelId: string, numOutputs: number): number {
  const model = getModelById(modelId);
  if (!model) {
    throw new Error(`Model not found: ${modelId}`);
  }
  return model.costPerUnit * numOutputs;
}
