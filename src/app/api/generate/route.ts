import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import { MODELS, Category } from "@/lib/models";

interface RequestBody {
  modelId: string;
  category: Category;
  prompt: string;
  referenceImage?: string;
  settings: {
    aspectRatio?: string;
    resolution?: string;
    duration?: number;
    numOutputs?: number;
    seed?: number;
    steps?: number;
    guidanceScale?: number;
    safetyTolerance?: string;
    cfgScale?: number;
    imageSize?: string;
  };
}

interface NormalizedOutput {
  url: string;
  type: "image" | "video";
  fileName: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
}

function buildInput(body: RequestBody, model: (typeof MODELS)[string]): Record<string, unknown> {
  const { prompt, referenceImage, settings, category } = body;
  const input: Record<string, unknown> = {};
  const modelId = body.modelId;

  if (prompt && prompt.trim()) {
    input.prompt = prompt;
  } else if (category !== "image-to-video") {
    input.prompt = prompt || "";
  }

  if (model.params.aspectRatio && settings.aspectRatio) {
    input.aspect_ratio = settings.aspectRatio;
  } else if (model.defaults.aspectRatio) {
    input.aspect_ratio = model.defaults.aspectRatio;
  }

  if (model.params.resolution && settings.resolution) {
    if (model.unit === "video") {
      input.resolution = settings.resolution.toLowerCase();
    } else {
      input.resolution = settings.resolution;
    }
  } else if (model.defaults.resolution) {
    if (model.unit === "video") {
      input.resolution = model.defaults.resolution.toLowerCase();
    } else {
      input.resolution = model.defaults.resolution;
    }
  }

  if (model.params.duration && settings.duration) {
    if (modelId.includes("veo")) {
      input.duration = `${settings.duration}s`;
    } else if (modelId.includes("kling")) {
      input.duration = String(settings.duration);
    } else {
      input.duration = settings.duration;
    }
  } else if (model.defaults.duration) {
    if (modelId.includes("veo")) {
      input.duration = `${model.defaults.duration}s`;
    } else if (modelId.includes("kling")) {
      input.duration = String(model.defaults.duration);
    } else {
      input.duration = model.defaults.duration;
    }
  }

  if (model.params.numOutputs) {
    input.num_images = settings.numOutputs ?? model.defaults.numOutputs;
  }

  if (model.params.seed && settings.seed !== undefined) {
    input.seed = settings.seed;
  }

  if (model.params.steps && settings.steps !== undefined) {
    input.num_inference_steps = settings.steps;
  } else if (model.defaults.steps !== undefined) {
    input.num_inference_steps = model.defaults.steps;
  }

  if (model.params.guidanceScale && settings.guidanceScale !== undefined) {
    input.guidance_scale = settings.guidanceScale;
  } else if (model.defaults.guidanceScale !== undefined) {
    input.guidance_scale = model.defaults.guidanceScale;
  }

  if (model.params.safetyTolerance && settings.safetyTolerance) {
    input.safety_tolerance = settings.safetyTolerance;
  }

  if (model.params.cfgScale && settings.cfgScale !== undefined) {
    input.cfg_scale = settings.cfgScale;
  } else if (model.defaults.cfgScale !== undefined) {
    input.cfg_scale = model.defaults.cfgScale;
  }

  if (model.params.imageSize && settings.imageSize) {
    input.image_size = settings.imageSize;
  } else if (model.defaults.imageSize) {
    input.image_size = model.defaults.imageSize;
  }

  if (category === "image-to-image" && referenceImage) {
    if (modelId.includes("kling-video/v2.6") || modelId.includes("kling-video/v3")) {
      input.start_image_url = referenceImage;
    } else if (modelId.includes("veo") || modelId.includes("kling-video/v2.5")) {
      input.image_url = referenceImage;
    } else {
      input.image_urls = [referenceImage];
    }
  }

  if (category === "image-to-video" && referenceImage) {
    if (modelId.includes("kling-video/v2.6") || modelId.includes("kling-video/v3")) {
      input.start_image_url = referenceImage;
    } else {
      input.image_url = referenceImage;
    }
  }

  return input;
}

function normalizeOutputs(
  data: Record<string, unknown>,
  model: (typeof MODELS)[string]
): NormalizedOutput[] {
  const outputs: NormalizedOutput[] = [];
  const type = model.unit;

  if (type === "image" && Array.isArray(data.images)) {
    for (const img of data.images) {
      if (typeof img === "object" && img !== null && "url" in img) {
        outputs.push({
          url: img.url as string,
          type: "image",
          fileName: `image-${Date.now()}-${Math.random().toString(36).slice(2)}.png`,
          width: img.width as number | undefined,
          height: img.height as number | undefined,
        });
      } else if (typeof img === "string") {
        outputs.push({
          url: img,
          type: "image",
          fileName: `image-${Date.now()}-${Math.random().toString(36).slice(2)}.png`,
        });
      }
    }
  }

  if (type === "video") {
    if (data.video && typeof data.video === "object" && "url" in data.video) {
      const video = data.video as Record<string, unknown>;
      outputs.push({
        url: video.url as string,
        type: "video",
        fileName: `video-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`,
        width: video.width as number | undefined,
        height: video.height as number | undefined,
        duration: video.duration as number | undefined,
        thumbnailUrl: video.thumbnail_url as string | undefined,
      });
    }

    if (Array.isArray(data.videos)) {
      for (const vid of data.videos) {
        if (typeof vid === "object" && vid !== null && "url" in vid) {
          outputs.push({
            url: vid.url as string,
            type: "video",
            fileName: `video-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`,
            width: vid.width as number | undefined,
            height: vid.height as number | undefined,
            duration: vid.duration as number | undefined,
            thumbnailUrl: vid.thumbnail_url as string | undefined,
          });
        }
      }
    }
  }

  return outputs;
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("X-FAL-Key") || process.env.FAL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is required. Add your fal.ai API key in settings." },
      { status: 401 }
    );
  }

  fal.config({
    credentials: apiKey,
  });

  try {
    const body: RequestBody = await request.json();

    if (!body.modelId || typeof body.modelId !== "string") {
      return NextResponse.json(
        { error: "modelId is required and must be a string" },
        { status: 400 }
      );
    }

    if (body.category !== "image-to-video" && (!body.prompt || typeof body.prompt !== "string" || !body.prompt.trim())) {
      return NextResponse.json(
        { error: "prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (body.prompt !== undefined && body.prompt !== null && typeof body.prompt !== "string") {
      return NextResponse.json(
        { error: "prompt must be a string if provided" },
        { status: 400 }
      );
    }

    const model = MODELS[body.modelId];
    if (!model) {
      return NextResponse.json(
        { error: `Unknown model: ${body.modelId}` },
        { status: 400 }
      );
    }

    if ((body.category === "image-to-image" || body.category === "image-to-video") && !body.referenceImage) {
      return NextResponse.json(
        { error: "referenceImage is required for image-to-image and image-to-video categories" },
        { status: 400 }
      );
    }

    const input = buildInput(body, model);

    const result = await fal.subscribe(body.modelId, { input });

    const outputs = normalizeOutputs(
      result.data as Record<string, unknown>,
      model
    );

    if (outputs.length === 0) {
      return NextResponse.json(
        { error: "No outputs generated from the model" },
        { status: 500 }
      );
    }

    return NextResponse.json({ outputs });
  } catch (error) {
    console.error("Error generating content:", error);

    if (error instanceof Error) {
      const message = error.message.includes("credentials")
        ? "Invalid API key. Please check your fal.ai API key."
        : error.message || "Failed to generate content";

      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
