"use client";

import React from "react";

const STAGES = [
  {
    id: "search",
    activeLabel: "Searching primary sources…",
    doneLabel: "Sources retrieved and indexed.",
  },
  {
    id: "reader",
    activeLabel: "Reading selected documents…",
    doneLabel: "Primary documents analyzed.",
  },
  {
    id: "writer",
    activeLabel: "Synthesizing research dispatch…",
    doneLabel: "Synthesis drafted.",
  },
  {
    id: "critic",
    activeLabel: "Conducting peer editorial review…",
    doneLabel: "Editorial appraisal finalized.",
  },
];

export default function ResearchProgress({
  currentStage = null,
  stagesState = {},
  isCompleted = false,
  error = null,
}) {
  const stageOrder = ["search", "reader", "writer", "critic"];
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="w-full max-w-[720px] mx-auto my-6 pl-2 py-3 editorial-fade">
      {error ? (
        <div className="p-3.5 rounded-[6px] border border-[#ECD1D1] dark:border-[#422121] bg-[#FAF3F3] dark:bg-[#1E1414] text-xs font-serif italic text-[#8F3B3B] dark:text-[#E28383]">
          Inquiry interrupted: {error}
        </div>
      ) : (
        <div className="relative pl-6 space-y-4">
          {/* Thin quiet vertical timeline hairline */}
          <div className="absolute top-2 bottom-2 left-[5px] w-[1px] bg-[#D9D2C0] dark:bg-[#2C2720]" />

          {STAGES.map((stage, idx) => {
            const state = stagesState[stage.id];
            const isDone =
              isCompleted ||
              (state && state.status === "completed") ||
              (currentIndex > idx);
            const isRunning =
              !isCompleted &&
              (currentStage === stage.id || (state && state.status === "running"));

            // Don't render future steps until reached
            if (!isDone && !isRunning && currentIndex < idx && currentStage !== null) {
              return null;
            }

            return (
              <div key={stage.id} className="relative flex items-center gap-3 text-xs sm:text-sm">
                {/* Brass Dot / Indicator */}
                <div className="absolute -left-6 flex items-center justify-center w-[11px] h-[11px]">
                  {isDone ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] dark:bg-[#B8975A]" />
                  ) : isRunning ? (
                    <span className="w-2 h-2 rounded-full border border-[#1F3D2F] dark:border-[#B8975A] bg-[#F3EFE6] dark:bg-[#14120F]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9D2C0] dark:bg-[#2C2720]" />
                  )}
                </div>

                {/* Step Text */}
                <div className="font-serif italic transition-opacity duration-200">
                  {isRunning ? (
                    <span className="text-[#1B1F1C] dark:text-[#EDE6D8] font-normal">
                      {state?.message || stage.activeLabel}
                      <span className="blinking-cursor" />
                    </span>
                  ) : isDone ? (
                    <span className="text-[#7A7566] dark:text-[#8F8778]">
                      {stage.doneLabel}
                    </span>
                  ) : (
                    <span className="text-[#7A7566]/60 dark:text-[#8F8778]/60">
                      {stage.activeLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
