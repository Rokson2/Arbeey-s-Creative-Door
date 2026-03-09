"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { QueueItem, GeneratedContent, ModelSettings, Category } from "@/lib/types";
import { MODELS, calculateCost } from "@/lib/models";

interface QueueContextType {
  queue: QueueItem[];
  completedItems: QueueItem[];
  addToQueue: (
    modelId: string,
    category: Category,
    prompt: string,
    referenceImages: string[] | undefined, // Changed to array
    settings: ModelSettings,
    apiKey: string
  ) => string;
  removeFromQueue: (id: string) => void;
  clearCompleted: () => void;
}

const QueueContext = createContext<QueueContextType | null>(null);

// Estimated durations in seconds for different model types
const ESTIMATED_DURATIONS: Record<string, number> = {
  // Text-to-Image
  "fal-ai/nano-banana-2": 15,
  "fal-ai/bytedance/seedream/v4.5/text-to-image": 10,
  
  // Image-to-Image
  "fal-ai/nano-banana-pro/edit": 20,
  "fal-ai/nano-banana-2/edit": 20,
  "fal-ai/bytedance/seedream/v4.5/image-to-image": 12,
  "fal-ai/bytedance/seedream/v5-lite/image-to-image": 10,
  
  // Text-to-Video
  "fal-ai/veo-3.1-generate-001": 120,
  "fal-ai/veo-3.1-fast-generate-001": 60,
  
  // Image-to-Video
  "fal-ai/veo-3.1-generate-001/image-to-video": 120,
  "fal-ai/veo-3.1-fast-generate-001/image-to-video": 60,
  "fal-ai/kling-video/v2.5/image-to-video": 90,
  "fal-ai/kling-video/v2.6-pro/image-to-video": 100,
  "fal-ai/kling-video/v3-pro/image-to-video": 110,
};

function getEstimatedDuration(modelId: string): number {
  return ESTIMATED_DURATIONS[modelId] || 30;
}

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [completedItems, setCompletedItems] = useState<QueueItem[]>([]);
  const processingRef = useRef<Set<string>>(new Set());

  // Process a single queue item - completely independent
  const processQueueItem = useCallback(async (item: QueueItem) => {
    // Skip if already processing
    if (processingRef.current.has(item.id)) {
      console.log(`Item ${item.id} already processing, skipping`);
      return;
    }
    
    processingRef.current.add(item.id);
    console.log(`Starting to process item ${item.id}`);

    // Update status to generating
    setQueue((prev) =>
      prev.map((i) => i.id === item.id ? { ...i, status: "generating", startTime: Date.now() } : i)
    );

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-FAL-Key": item.apiKey,
        },
        body: JSON.stringify({
          modelId: item.modelId,
          category: item.category,
          prompt: item.prompt,
          referenceImages: item.referenceImages, // Send as array
          settings: item.settings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate: ${response.status}`);
      }

      const data = await response.json();
      const outputs = data.outputs || [];

      const model = MODELS[item.modelId];
      const results: GeneratedContent[] = outputs.map(
        (output: { url: string; type: string; fileName: string; width?: number; height?: number; duration?: number; thumbnailUrl?: string }, index: number) => ({
          id: `${item.id}-${index}`,
          url: output.url,
          prompt: item.prompt || "(No prompt)",
          timestamp: new Date(),
          settings: { ...item.settings },
          fileName: output.fileName,
          width: output.width,
          height: output.height,
          cost: calculateCost(item.modelId, 1),
          modelId: item.modelId,
          modelName: model?.name || "Unknown",
          category: item.category,
          outputType: output.type as "image" | "video",
          duration: output.duration,
          thumbnailUrl: output.thumbnailUrl,
        })
      );

      console.log(`Item ${item.id} completed successfully`);

      // Mark as completed
      setQueue((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, status: "completed", progress: 100, results } : i)
      );

      // Move to completed after 3 seconds
      setTimeout(() => {
        setQueue((prev) => {
          const completed = prev.find((i) => i.id === item.id);
          if (completed && completed.status === "completed") {
            setCompletedItems((prevCompleted) => [completed, ...prevCompleted].slice(0, 20));
            return prev.filter((i) => i.id !== item.id);
          }
          return prev;
        });
      }, 3000);

    } catch (error) {
      console.error(`Item ${item.id} failed:`, error);
      setQueue((prev) =>
        prev.map((i) => i.id === item.id ? {
          ...i,
          status: "failed",
          error: error instanceof Error ? error.message : "Failed to generate content",
        } : i)
      );
    } finally {
      processingRef.current.delete(item.id);
    }
  }, []);

  // Watch for new pending items and process them immediately
  useEffect(() => {
    queue.forEach((item) => {
      if (item.status === "pending" && !processingRef.current.has(item.id)) {
        console.log(`Found pending item ${item.id}, starting processing`);
        // Process immediately without blocking
        processQueueItem(item);
      }
    });
  }, [queue, processQueueItem]);

  // Update progress based on elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prev) =>
        prev.map((item) => {
          if (item.status === "generating" && item.startTime) {
            const elapsed = (Date.now() - item.startTime) / 1000;
            const progress = Math.min(95, (elapsed / item.estimatedDuration) * 100);
            return { ...item, progress };
          }
          return item;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const addToQueue = useCallback(
    (
      modelId: string,
      category: Category,
      prompt: string,
      referenceImages: string[] | undefined, // Accept array
      settings: ModelSettings,
      apiKey: string
    ): string => {
      const id = `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const model = MODELS[modelId];
      const estimatedDuration = getEstimatedDuration(modelId);

      const newItem: QueueItem = {
        id,
        modelId,
        modelName: model?.name || "Unknown",
        category,
        prompt,
        referenceImages, // Store as array
        settings,
        status: "pending",
        progress: 0,
        startTime: null,
        estimatedDuration,
        cost: calculateCost(modelId, settings.numOutputs),
        apiKey,
      };

      console.log(`Adding item ${id} to queue`);
      setQueue((prev) => [...prev, newItem]);
      return id;
    },
    []
  );

  const removeFromQueue = useCallback((id: string) => {
    console.log(`Removing item ${id} from queue`);
    setQueue((prev) => prev.filter((item) => item.id !== id));
    processingRef.current.delete(id);
  }, []);

  const clearCompleted = useCallback(() => {
    setCompletedItems([]);
  }, []);

  return (
    <QueueContext.Provider
      value={{
        queue,
        completedItems,
        addToQueue,
        removeFromQueue,
        clearCompleted,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
}
