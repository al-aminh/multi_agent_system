"use client";

import React, { useState } from "react";
import {
  Search,
  Globe,
  PenTool,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";

const STAGES = [
  {
    id: "search",
    name: "Search Agent",
    tool: "Tavily Search",
    defaultDesc: "Finding recent and reliable sources on the web",
    icon: Search,
  },
  {
    id: "reader",
    name: "Reader Agent",
    tool: "BeautifulSoup",
    defaultDesc: "Extracting in-depth content from selected URLs",
    icon: Globe,
  },
  {
    id: "writer",
    name: "Writer Chain",
    tool: "Groq LLM",
    defaultDesc: "Synthesizing research into a structured report",
    icon: PenTool,
  },
  {
    id: "critic",
    name: "Critic Chain",
    tool: "AI Reviewer",
    defaultDesc: "Evaluating report quality, strengths & verdict",
    icon: ShieldCheck,
  },
];

export default function ResearchProgress({
  currentStage = null,
  stagesState = {}, // { search: { status: 'completed', message: '...' }, ... }
  isCompleted = false,
  error = null,
  initialCollapsed = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  // Determine stage status helper
  const getStageInfo = (stageId, index) => {
    const state = stagesState[stageId];
    if (state) {
      return {
        status: state.status, // 'running' | 'completed' | 'failed'
        message: state.message,
      };
    }

    // Infer from current active stage if stagesState doesn't have it yet
    if (currentStage === stageId) {
      return { status: "running", message: "In progress..." };
    }

    // Check if previous stage is completed
    const stageOrder = ["search", "reader", "writer", "critic"];
    const currentIndex = stageOrder.indexOf(currentStage);

    if (isCompleted) {
      return { status: "completed", message: "Step completed" };
    }

    if (currentIndex > index) {
      return { status: "completed", message: "Step completed" };
    }

    return { status: "waiting", message: "Waiting in pipeline..." };
  };

  return (
    <div className="w-full my-4 rounded-xl bg-[#0F1117] border border-[rgba(255,255,255,0.08)] overflow-hidden transition-all shadow-lg">
      {/* Header bar */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-4 py-3 bg-[#13151D] flex items-center justify-between cursor-pointer hover:bg-[#161822] transition-colors border-b border-[rgba(255,255,255,0.05)]"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-violet-500/10 text-violet-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-[#E2E4E9] uppercase font-mono">
            Research Workflow
          </span>

          {/* Quick status pill in header */}
          {error ? (
            <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[11px] font-medium border border-red-500/25">
              Pipeline Error
            </span>
          ) : isCompleted ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-medium border border-emerald-500/25 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All 4 Agents Completed
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-[11px] font-medium border border-violet-500/25 flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
              Agents Executing...
            </span>
          )}
        </div>

        <button
          type="button"
          className="text-[#646775] hover:text-[#9A9CA5] p-1 rounded transition-colors text-xs flex items-center gap-1"
        >
          <span>{isCollapsed ? "Show Workflow" : "Hide Workflow"}</span>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Workflow Steps */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {STAGES.map((stage, idx) => {
            const { status, message } = getStageInfo(stage.id, idx);
            const Icon = stage.icon;

            const isRunning = status === "running";
            const isDone = status === "completed";
            const isFailed = status === "failed";
            const isWaiting = status === "waiting";

            return (
              <div
                key={stage.id}
                className={`relative flex items-start gap-3.5 p-3 rounded-lg transition-all duration-200 ${
                  isRunning
                    ? "bg-violet-950/20 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.12)]"
                    : isDone
                    ? "bg-[#14161F]/60 border border-[rgba(255,255,255,0.05)]"
                    : "bg-[#111318]/40 border border-transparent opacity-60"
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isRunning ? (
                    <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    </div>
                  ) : isDone ? (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isFailed ? (
                    <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#555866]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Stage Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {stage.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#8A8D9B] border border-white/10">
                        {stage.tool}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-mono capitalize ${
                        isRunning
                          ? "text-violet-400 font-medium animate-pulse"
                          : isDone
                          ? "text-emerald-400"
                          : isFailed
                          ? "text-red-400"
                          : "text-[#555866]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-[#9A9CA5] mt-1 leading-relaxed">
                    {message || stage.defaultDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

