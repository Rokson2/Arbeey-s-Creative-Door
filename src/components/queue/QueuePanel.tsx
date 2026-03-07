"use client";

import React, { useState } from "react";
import { useQueue } from "./QueueContext";
import { QueueItem } from "./QueueItem";

export function QueuePanel() {
  const { queue, completedItems, clearCompleted, removeFromQueue } = useQueue();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const activeItems = queue.filter((item) => item.status !== "completed");
  const allItems = [...activeItems, ...completedItems];
  const generatingCount = queue.filter((i) => i.status === "generating").length;
  const completedCount = completedItems.length;

  if (allItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 max-w-sm">
      {/* Summary badge when collapsed */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg hover:bg-zinc-800/95 transition-colors"
        >
          {generatingCount > 0 ? (
            <>
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
              <span className="text-sm text-zinc-100">
                {generatingCount} generating
              </span>
            </>
          ) : completedCount > 0 ? (
            <>
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 13 14 18" />
                </svg>
              </div>
              <span className="text-sm text-zinc-100">
                {completedCount} done
              </span>
            </>
          ) : (
            <span className="text-sm text-zinc-100">
              {allItems.length} in queue
            </span>
          )}
          <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}

      {/* Expanded panel */}
      {isExpanded && (
        <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-100">Queue</span>
              {generatingCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  {generatingCount} active
                </span>
              )}
              {completedCount > 0 && (
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                    showCompleted 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {completedCount} done
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {completedCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                  title="Clear completed"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Collapse"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Items list */}
          <div className="max-h-64 overflow-y-auto">
            {activeItems.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                onRemove={removeFromQueue}
              />
            ))}
            {showCompleted && completedItems.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                onRemove={removeFromQueue}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
