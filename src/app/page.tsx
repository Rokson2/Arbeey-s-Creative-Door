"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { GeneratedContent, ModelSettings, Category } from "@/lib/types";
import {
  ModelConfig,
  MODELS,
  getModelsByCategory,
  getDefaultModel,
  calculateCost,
  DEFAULT_ASPECT_RATIOS,
  DEFAULT_RESOLUTIONS,
  DEFAULT_DURATIONS,
  VIDEO_RESOLUTIONS,
} from "@/lib/models";
import { QueueProvider, useQueue, QueuePanel } from "@/components/queue";

const CATEGORY_LABELS: Record<Category, string> = {
  "text-to-image": "Text → Image",
  "image-to-image": "Image → Image",
  "text-to-video": "Text → Video",
  "image-to-video": "Image → Video",
};

function HomeContent() {
  const [category, setCategory] = useState<Category>("text-to-image");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);

  const [modelSettings, setModelSettings] = useState<ModelSettings>({
    aspectRatio: "1:1",
    resolution: "1K",
    imageSize: "auto_2K",
    duration: 5,
    numOutputs: 1,
    seed: null,
    cfgScale: 0.5,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [sessionSpent, setSessionSpent] = useState(0);
  const [spendingLimit, setSpendingLimit] = useState(5);
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const { addToQueue, queue, completedItems } = useQueue();

  // Load saved settings
  useEffect(() => {
    const storedApiKey = localStorage.getItem("fal-api-key");
    const storedLimit = localStorage.getItem("fal-spending-limit");
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedLimit) setSpendingLimit(parseFloat(storedLimit));
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem("fal-api-key", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("fal-spending-limit", spendingLimit.toString());
  }, [spendingLimit]);

  // Set default model when category changes
  useEffect(() => {
    const defaultModel = getDefaultModel(category);
    setSelectedModelId(defaultModel.id);
    setModelSettings({
      aspectRatio: defaultModel.defaults.aspectRatio || "1:1",
      resolution: defaultModel.defaults.resolution || "1K",
      imageSize: defaultModel.defaults.imageSize || "auto_2K",
      duration: defaultModel.defaults.duration || 5,
      numOutputs: defaultModel.defaults.numOutputs,
      seed: defaultModel.defaults.seed ?? null,
      steps: defaultModel.defaults.steps,
      guidanceScale: defaultModel.defaults.guidanceScale,
      cfgScale: defaultModel.defaults.cfgScale ?? 0.5,
    });
    setReferenceImages([]);
  }, [category]);

  // Listen for completed queue items and add to generated content
  useEffect(() => {
    completedItems.forEach((item) => {
      if (item.results && item.results.length > 0) {
        setGeneratedContent((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newContent = item.results!.filter((r) => !existingIds.has(r.id));
          if (newContent.length > 0) {
            setSessionSpent((prevSpent) => prevSpent + item.cost);
          }
          return [...newContent, ...prev];
        });
      }
    });
  }, [completedItems]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const selectedModel = selectedModelId ? MODELS[selectedModelId] : null;
  const estimatedCost = selectedModel ? calculateCost(selectedModelId, modelSettings.numOutputs) : 0;
  const isOverLimit = sessionSpent >= spendingLimit;
  const isNearLimit = sessionSpent / spendingLimit >= 0.8 && !isOverLimit;
  const requiresReferenceImage = category === "image-to-image" || category === "image-to-video";
  const isVideoCategory = category === "text-to-video" || category === "image-to-video";
  const supportsMultipleImages = selectedModel?.supportsMultipleImages || false;

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setPrompt("");
    setReferenceImages([]);
    setUrlInput("");
    setError(null);
  };

  const handleModelChange = (modelId: string) => {
    const model = MODELS[modelId];
    if (!model) return;
    setSelectedModelId(modelId);
    setModelSettings({
      aspectRatio: model.defaults.aspectRatio || "1:1",
      resolution: model.defaults.resolution || "1K",
      imageSize: model.defaults.imageSize || "auto_2K",
      duration: model.defaults.duration || 5,
      numOutputs: model.defaults.numOutputs,
      seed: model.defaults.seed ?? null,
      steps: model.defaults.steps,
      guidanceScale: model.defaults.guidanceScale,
      cfgScale: model.defaults.cfgScale ?? 0.5,
    });
    setReferenceImages([]);
  };

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setReferenceImages((prev) => [...prev, base64]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUrlInput = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    setReferenceImages((prev) => [...prev, url]);
    setUrlInput("");
  }, [urlInput]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const base64 = ev.target?.result as string;
            setReferenceImages((prev) => [...prev, base64]);
          };
          reader.readAsDataURL(file);
        }
      });
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const base64 = ev.target?.result as string;
            setReferenceImages((prev) => [...prev, base64]);
          };
          reader.readAsDataURL(file);
        }
      });
    },
    []
  );

  const removeImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearReferenceImages = () => {
    setReferenceImages([]);
    setUrlInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = () => {
    if (!apiKey.trim()) {
      setError("Please enter your fal.ai API key in settings");
      return;
    }

    if (!prompt.trim() && category !== "image-to-video") {
      setError("Please enter a prompt");
      return;
    }

    if (requiresReferenceImage && referenceImages.length === 0) {
      setError(`At least one reference image is required for ${CATEGORY_LABELS[category]}`);
      return;
    }

    if (isOverLimit) {
      setError("Session spending limit reached. Reset session to continue.");
      return;
    }

    if (!selectedModelId) {
      setError("Please select a model");
      return;
    }

    setError(null);

    // Add to queue - pass array of images
    addToQueue(
      selectedModelId,
      category,
      prompt.trim(),
      referenceImages.length > 0 ? referenceImages : undefined,
      modelSettings,
      apiKey
    );
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "generated-content";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError("Failed to download file");
    }
  };

  const handleUseAsReference = (imageUrl: string) => {
    setReferenceImages([imageUrl]);
    if (category === "text-to-image") {
      setCategory("image-to-image");
    } else if (category === "text-to-video") {
      setCategory("image-to-video");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      promptRef.current?.focus();
    }, 300);
  };

  const resetSession = () => {
    setSessionSpent(0);
    setError(null);
  };

  const modelsInCategory = getModelsByCategory(category);
  const aspectRatioOptions = selectedModel?.aspectRatioOptions || DEFAULT_ASPECT_RATIOS;
  const resolutionOptions = isVideoCategory
    ? (selectedModel?.resolutionOptions || VIDEO_RESOLUTIONS)
    : (selectedModel?.resolutionOptions || DEFAULT_RESOLUTIONS);
  const durationOptions = selectedModel?.durationOptions || DEFAULT_DURATIONS;

  // Only disable if missing required inputs
  const isGenerateDisabled =
    (!prompt.trim() && category !== "image-to-video") ||
    !apiKey.trim() ||
    isOverLimit ||
    (requiresReferenceImage && referenceImages.length === 0);

  const activeQueueCount = queue.filter((i) => i.status === "generating" || i.status === "pending").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight">Arbeey&apos;s Creative Door</h1>
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                isOverLimit
                  ? "bg-red-950/50 text-red-400"
                  : isNearLimit
                  ? "bg-yellow-950/50 text-yellow-400"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              <span>
                Spent: ${sessionSpent.toFixed(2)} / ${spendingLimit.toFixed(2)} limit
              </span>
              {activeQueueCount > 0 && (
                <span className="ml-1 rounded bg-blue-900/50 px-1.5 py-0.5 text-xs font-medium text-blue-300">
                  {activeQueueCount} generating
                </span>
              )}
              {isOverLimit && (
                <span className="ml-1 rounded bg-red-900/50 px-1.5 py-0.5 text-xs font-medium">LIMIT</span>
              )}
              {isNearLimit && !isOverLimit && (
                <span className="ml-1 rounded bg-yellow-900/50 px-1.5 py-0.5 text-xs font-medium">WARN</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetSession}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            >
              Reset Session
            </button>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex gap-2">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-white text-zinc-950"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Model</label>
              <select
                value={selectedModelId}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
              >
                {modelsInCategory.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - ${model.costPerUnit.toFixed(3)}/{model.unit}
                    {model.supportsMultipleImages && " (Multi-image)"}
                  </option>
                ))}
              </select>
              {selectedModel?.description && (
                <p className="text-xs text-zinc-500">
                  {selectedModel.description}
                  {selectedModel.supportsMultipleImages && " • Supports multiple reference images"}
                </p>
              )}
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">
                Prompt {category === "image-to-video" && <span className="text-zinc-600">(Optional)</span>}
              </label>
              <textarea
                ref={promptRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  isVideoCategory
                    ? "Describe the video you want to generate..."
                    : "Describe the image you want to generate..."
                }
                className="h-32 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600/20"
              />
            </div>

            {/* Reference Images Upload */}
            {requiresReferenceImage && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">
                  Reference Images{" "}
                  <span className={category === "image-to-image" ? "text-red-400" : "text-zinc-600"}>
                    ({category === "image-to-image" ? "Required" : "Optional"})
                  </span>
                  {supportsMultipleImages && (
                    <span className="ml-2 text-xs text-blue-400">Add up to 4 images</span>
                  )}
                </label>

                {/* Image Previews */}
                {referenceImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {referenceImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Reference ${index + 1}`}
                          className="h-20 w-20 rounded-lg object-cover border border-zinc-700"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => {
                    if (supportsMultipleImages || referenceImages.length === 0) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors ${
                    (!supportsMultipleImages && referenceImages.length >= 1)
                      ? "border-zinc-700 bg-zinc-900/30 cursor-not-allowed opacity-50"
                      : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    multiple={supportsMultipleImages}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center py-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 text-zinc-600"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <p className="text-sm text-zinc-500">
                      {supportsMultipleImages
                        ? "Drag & drop or click to upload (multiple allowed)"
                        : "Drag & drop or click to upload"}
                    </p>
                  </div>
                </div>

                {/* URL Input */}
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <span className="text-xs text-zinc-600">or</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUrlInput();
                      }
                    }}
                  />
                  <button
                    onClick={handleUrlInput}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
                  >
                    Add
                  </button>
                </div>

                {/* Clear All Button */}
                {referenceImages.length > 0 && (
                  <button
                    onClick={clearReferenceImages}
                    className="w-full text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
                  >
                    Clear all images
                  </button>
                )}
              </div>
            )}

            {/* Model Settings */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
              <button
                onClick={() => setShowModelSettings(!showModelSettings)}
                className="flex w-full items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-400"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  <span className="text-sm font-medium text-zinc-400">Model Settings</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-zinc-500 transition-transform ${showModelSettings ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {showModelSettings && selectedModel && (
                <div className="grid grid-cols-2 gap-4 p-4 pt-0">
                  {selectedModel.params.aspectRatio && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Aspect Ratio</label>
                      <select
                        value={modelSettings.aspectRatio}
                        onChange={(e) => setModelSettings((s) => ({ ...s, aspectRatio: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                      >
                        {aspectRatioOptions.map((ar) => (
                          <option key={ar} value={ar}>
                            {ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedModel.params.resolution && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Resolution</label>
                      <select
                        value={modelSettings.resolution}
                        onChange={(e) => setModelSettings((s) => ({ ...s, resolution: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                      >
                        {resolutionOptions.map((res) => (
                          <option key={res} value={res}>
                            {res}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedModel.params.duration && isVideoCategory && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Duration (s)</label>
                      <select
                        value={modelSettings.duration}
                        onChange={(e) => setModelSettings((s) => ({ ...s, duration: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                      >
                        {durationOptions.map((dur) => (
                          <option key={dur} value={dur}>
                            {dur}s
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedModel.params.numOutputs && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Number of Outputs</label>
                      <select
                        value={modelSettings.numOutputs}
                        onChange={(e) => setModelSettings((s) => ({ ...s, numOutputs: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedModel.params.seed && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Seed (Optional)</label>
                      <input
                        type="number"
                        value={modelSettings.seed ?? ""}
                        onChange={(e) =>
                          setModelSettings((s) => ({
                            ...s,
                            seed: e.target.value ? parseInt(e.target.value) : null,
                          }))
                        }
                        placeholder="Random"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                      />
                    </div>
                  )}
                  {selectedModel.params.steps && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Steps</label>
                      <input
                        type="number"
                        value={modelSettings.steps ?? ""}
                        onChange={(e) =>
                          setModelSettings((s) => ({
                            ...s,
                            steps: e.target.value ? parseInt(e.target.value) : undefined,
                          }))
                        }
                        placeholder="Default"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                      />
                    </div>
                  )}
                  {selectedModel.params.guidanceScale && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Guidance Scale</label>
                      <input
                        type="number"
                        step="0.1"
                        value={modelSettings.guidanceScale ?? ""}
                        onChange={(e) =>
                          setModelSettings((s) => ({
                            ...s,
                            guidanceScale: e.target.value ? parseFloat(e.target.value) : undefined,
                          }))
                        }
                        placeholder="Default"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                      />
                    </div>
                  )}
                  {selectedModel.params.imageSize && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Image Size</label>
                      <select
                        value={modelSettings.imageSize || "auto_2K"}
                        onChange={(e) => setModelSettings((s) => ({ ...s, imageSize: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none"
                      >
                        {(selectedModel.imageSizeOptions || []).map((size: string) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedModel.params.cfgScale && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">CFG Scale</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={modelSettings.cfgScale ?? 0.5}
                        onChange={(e) => setModelSettings((s) => ({ ...s, cfgScale: parseFloat(e.target.value) }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
                {error}
              </div>
            )}

            {/* Generate Button */}
            <div className="space-y-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                Generate - Est: ${estimatedCost.toFixed(3)}
              </button>
              <p className="text-center text-xs text-zinc-500">
                {activeQueueCount > 0 
                  ? `${activeQueueCount} item${activeQueueCount > 1 ? 's' : ''} in queue - submit more!`
                  : "Submit multiple requests - they will process in parallel"}
              </p>
            </div>

            {/* Generated Content Gallery */}
            {generatedContent.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Generated Content</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {generatedContent.map((content) => (
                    <div
                      key={content.id}
                      className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                    >
                      <div className="relative aspect-square">
                        {content.outputType === "video" ? (
                          <video
                            src={content.url}
                            controls
                            className="h-full w-full object-cover"
                            poster={content.thumbnailUrl}
                          />
                        ) : (
                          <img
                            src={content.url}
                            alt={content.prompt}
                            className="h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute right-2 top-2 flex gap-2">
                          {content.outputType === "image" && (
                            <button
                              onClick={() => handleUseAsReference(content.url)}
                              className="rounded-lg bg-zinc-950/80 px-2 py-1.5 text-xs font-medium text-zinc-100 backdrop-blur-sm transition-colors hover:bg-zinc-950"
                            >
                              Use as Reference
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(content.url, content.fileName)}
                            title="Downloads to your Downloads folder"
                            className="rounded-lg bg-zinc-950/80 p-2 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-zinc-950"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-2 text-sm text-zinc-400">{content.prompt}</p>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                          <span>Cost: ${content.cost.toFixed(3)}</span>
                          <span>Model: {content.modelName}</span>
                          <span>{CATEGORY_LABELS[content.category]}</span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-600">{content.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-zinc-600">
                  Files are downloaded to your Downloads folder when you click the download button
                </p>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div
            className={`space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all ${
              isSettingsOpen ? "block" : "hidden"
            }`}
          >
            <h3 className="font-semibold">User Settings</h3>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">fal.ai API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your fal.ai API key"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                >
                  {showApiKey ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Get your key at{" "}
                <a
                  href="https://fal.ai/dashboard/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 underline hover:text-zinc-300"
                >
                  fal.ai/dashboard/keys
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Session Spending Limit ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
              />
              <p className="text-xs text-zinc-600">
                Account balance is not available via API. Check your balance at{" "}
                <a
                  href="https://fal.ai/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 underline hover:text-zinc-300"
                >
                  fal.ai/dashboard
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel - Fixed at bottom right */}
      <QueuePanel />
    </div>
  );
}

export default function Home() {
  return (
    <QueueProvider>
      <HomeContent />
    </QueueProvider>
  );
}
