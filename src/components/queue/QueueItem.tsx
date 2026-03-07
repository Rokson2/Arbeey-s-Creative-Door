"use client";

import React, { useEffect, useState } from "react";
import type { QueueItem as QueueItemType } from "@/lib/types";

interface QueueItemProps {
  item: QueueItemType;
  onRemove: (id: string) => void;
}

export function QueueItem({ item, onRemove }: QueueItemProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (item.status === "generating" && item.startTime) {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - item.startTime!) / 1000;
      setTimeElapsed(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }

  if (item.status === "completed") {
    setShowCheckmark(true);
    const timeout = setTimeout(() => {
      setShowCheckmark(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }
  }, [item.status, item.startTime, item.estimatedDuration]);

  const progress = item.startTime
    ? Math.min((timeElapsed / item.estimatedDuration) * 100, 95)
    : 0;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const remainingTime = Math.max(0, item.estimatedDuration - timeElapsed);

  return (
    <div className="relative bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg overflow-hidden">
      {/* Progress bar background */}
      <div className="absolute inset-0 bg-zinc-800/30" />
      
      {/* Animated progress bar */}
      {item.status === "generating" && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="relative p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {item.status === "generating" ? (
                <div className="relative w-4 h-4">
                  <svg
                    className="w-4 h-4 text-blue-400 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : showCheckmark ? (
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 13 14 18" />
                  </svg>
                </div>
              ) : item.status === "failed" ? (
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-zinc-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-100 truncate">
                  {item.modelName}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">
                  {item.prompt.slice(0, 30)}...
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.status === "generating" && (
                <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                  {formatTime(remainingTime)}
                </span>
              )}
              {item.status === "completed" && (
                <span className="text-[10px] text-emerald-400 font-medium">
                  Done
                </span>
              )}
              {item.status === "failed" && (
                <span className="text-[10px] text-red-400 font-medium">
                  Failed
                </span>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cost badge */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-400">
              ${item.category.replace("-", " → ")}
            </span>
            <span className="text-[10px] text-zinc-500">
              ${item.cost.toFixed(3)}
            </span>
          </div>
        </div>

        {/* Error message */}
        {item.status === "failed" && item.error && (
          <div className="px-3 pb-2">
            <p className="text-[10px] text-red-400 truncate">
              {item.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
