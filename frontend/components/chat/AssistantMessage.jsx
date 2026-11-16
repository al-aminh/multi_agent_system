"use client";

import React from "react";
import ResearchProgress from "@/components/research/ResearchProgress";
import ResearchArticle from "@/components/research/ResearchArticle";

export default function AssistantMessage({
  message = null,
  isStreaming = false,
  currentStage = null,
  stagesState = {},
  error = null,
}) {
  const report = message?.report || message?.content || "";
  const searchResults = message?.search_results || "";
  const scrapedContent = message?.scraped_content || "";
  const feedback = message?.feedback || "";

  const isCompleted = !isStreaming && !error && Boolean(report);

  return (
    <div className="w-full">
      {/* Quiet vertical timeline while executing or if error */}
      {(isStreaming || (error && !report)) && (
        <ResearchProgress
          currentStage={currentStage}
          stagesState={stagesState}
          isCompleted={isCompleted}
          error={error}
        />
      )}

      {/* Magazine-style research article when report is available */}
      {report && (
        <ResearchArticle
          report={report}
          searchResults={searchResults}
          scrapedContent={scrapedContent}
          feedback={feedback}
        />
      )}
    </div>
  );
}
