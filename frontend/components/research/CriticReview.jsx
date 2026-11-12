"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Quote,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import { parseCriticReview } from "@/lib/utils";

export default function CriticReview({ feedback = "" }) {
  const [showRaw, setShowRaw] = useState(false);
  const parsed = parseCriticReview(feedback);

  // Score styling logic
  const score = parsed.score;
  const scoreColor =
    score !== null
      ? score >= 8
        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
        : score >= 6
        ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
        : "text-red-400 border-red-500/30 bg-red-500/10"
      : "text-violet-400 border-violet-500/30 bg-violet-500/10";

  return (
    <div className="p-5 md:p-7 bg-[#0F1117] rounded-xl space-y-6">
      {/* Top Banner: Score & Verdict */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 rounded-xl bg-[#13151D] border border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border shadow-lg flex-shrink-0 ${scoreColor}`}
          >
            <span className="text-2xl font-bold font-mono tracking-tight">
              {score !== null ? score : "--"}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
              Out of 10
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-violet-400 font-mono font-semibold uppercase mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>AI Critic Evaluation</span>
            </div>
            <h3 className="text-base font-semibold text-white">
              {score >= 8
                ? "High Quality Research Report"
                : score >= 6
                ? "Satisfactory Quality with Improvements"
                : "Needs Further Fact-Checking & Revisions"}
            </h3>
            <p className="text-xs text-[#8E909B] mt-0.5">
              Evaluated strictly for depth, clarity, factuality, and structure.
            </p>
          </div>
        </div>
      </div>

      {/* One-Line Verdict Banner */}
      {parsed.verdict && (
        <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/25 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-mono text-violet-300 uppercase font-semibold mb-1">
                One-Line Verdict
              </div>
              <p className="text-sm font-medium text-[#F3F4F6] italic leading-relaxed">
                "{parsed.verdict}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Strengths vs Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-[#12141A] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-[#E2E4E9] uppercase tracking-wider font-mono">
              Strengths
            </h4>
          </div>

          {parsed.strengths.length > 0 ? (
            <ul className="space-y-2">
              {parsed.strengths.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#C7C9D3] leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#646775]">No specific strengths identified.</p>
          )}
        </div>

        {/* Areas to Improve */}
        <div className="p-4 rounded-xl bg-[#12141A] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-semibold text-[#E2E4E9] uppercase tracking-wider font-mono">
              Areas to Improve
            </h4>
          </div>

          {parsed.improvements.length > 0 ? (
            <ul className="space-y-2">
              {parsed.improvements.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#C7C9D3] leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#646775]">No specific weaknesses identified.</p>
          )}
        </div>
      </div>

      {/* Expandable Raw Critic Output */}
      <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
        <div
          onClick={() => setShowRaw(!showRaw)}
          className="flex items-center justify-between cursor-pointer py-1 group"
        >
          <span className="text-xs text-[#646775] group-hover:text-[#9A9CA5] font-mono">
            {showRaw ? "Hide original critic review" : "View original critic review"}
          </span>
          <button type="button" className="text-[#646775] group-hover:text-[#9A9CA5]">
            {showRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showRaw && (
          <div className="mt-3 p-4 rounded-lg bg-[#0C0D10] border border-[rgba(255,255,255,0.06)]">
            <pre className="text-xs font-mono text-[#A1A4B0] whitespace-pre-wrap leading-relaxed">
              {feedback || "No feedback recorded."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

