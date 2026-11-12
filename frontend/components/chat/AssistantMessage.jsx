"use client";

import React from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import ResearchProgress from "@/components/research/ResearchProgress";
import ResearchTabs from "@/components/research/ResearchTabs";

export default function AssistantMessage({
  message = null,
  isStreaming = false,
  currentStage = null,
  stagesState = {},
  error = null,
}) {
  // If historical message loaded from DB
  const report = message?.report || message?.content || "";
  const searchResults = message?.search_results || "";
  const scrapedContent = message?.scraped_content || "";
  const feedback = message?.feedback || "";

  const isCompleted = !isStreaming && !error && Boolean(report);

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4 flex items-start gap-3">
      {/* Assistant Brand Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 p-[1px] flex-shrink-0 mt-0.5 shadow-md shadow-violet-950/50">
        <div className="w-full h-full rounded-full bg-[#0C0D10] flex items-center justify-center text-violet-400">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Error notification if pipeline failed */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-sm mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-300">Research Failed</div>
              <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Real-time Agent Progress Component */}
        {(isStreaming || isCompleted || error) && (
          <ResearchProgress
            currentStage={currentStage}
            stagesState={stagesState}
            isCompleted={isCompleted}
            error={error}
            initialCollapsed={isCompleted && !isStreaming}
          />
        )}

        {/* Results Component (Only visible once research report is available) */}
        {report && (
          <ResearchTabs
            report={report}
            searchResults={searchResults}
            scrapedContent={scrapedContent}
            feedback={feedback}
          />
        )}
      </div>
    </div>
  );
}

