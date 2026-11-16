"use client";

import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Scale,
  ArrowRight,
} from "lucide-react";
import { parseCriticReview } from "@/lib/utils";

export default function CriticReview({ feedback = "" }) {
  const [showRaw, setShowRaw] = useState(false);
  const parsed = parseCriticReview(feedback);

  const score = parsed.score;

  return (
    <div className="p-4 sm:p-6 bg-[#FBF9F4] rounded-[12px] space-y-5">
      {/* Top Banner: Score & Editorial Assessment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[10px] bg-[#F4F1EA] border border-[#E2DDD1]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[10px] bg-[#1F3D2F] text-[#F4F1EA] flex flex-col items-center justify-center flex-shrink-0 soft-button-shadow">
            <span className="font-serif text-2xl font-semibold tracking-tight">
              {score !== null ? score : "--"}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#E9E4D8]/80">
              out of 10
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#A67C52] font-mono font-medium uppercase mb-0.5">
              <Scale className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Editorial Assessment</span>
            </div>
            <h3 className="font-serif text-base font-semibold text-[#1F3D2F]">
              {score >= 8
                ? "Thorough, Well-Structured Research"
                : score >= 6
                ? "Satisfactory Quality with Noted Revisions"
                : "Preliminary Draft Requiring Further Evidence"}
            </h3>
            <p className="text-xs text-[#5E6460] mt-0.5">
              Evaluated strictly for depth, logical structure, source authority, and neutrality.
            </p>
          </div>
        </div>
      </div>

      {/* One-Line Verdict Quote */}
      {parsed.verdict && (
        <div className="p-4 rounded-[10px] bg-[#EFEBE0] border border-[#DDD7C9]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#A67C52] font-medium mb-1">
            Editorial Verdict
          </div>
          <p className="font-serif italic text-sm sm:text-[15px] text-[#1B1F1C] leading-relaxed">
            "{parsed.verdict}"
          </p>
        </div>
      )}

      {/* Strengths & Areas to Improve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Strengths */}
        <div className="p-4 rounded-[10px] bg-[#F4F1EA] border border-[#E2DDD1]">
          <div className="flex items-center gap-2 mb-2.5">
            <Check className="w-4 h-4 text-[#1F3D2F]" strokeWidth={2} />
            <h4 className="font-serif text-xs font-semibold text-[#1F3D2F] uppercase tracking-wide">
              Key Strengths
            </h4>
          </div>

          {parsed.strengths.length > 0 ? (
            <ul className="space-y-2">
              {parsed.strengths.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-[#353B37] leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F3D2F] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#858B86]">No specific strengths documented.</p>
          )}
        </div>

        {/* Areas to Improve */}
        <div className="p-4 rounded-[10px] bg-[#F4F1EA] border border-[#E2DDD1]">
          <div className="flex items-center gap-2 mb-2.5">
            <ArrowRight className="w-3.5 h-3.5 text-[#A67C52]" strokeWidth={1.5} />
            <h4 className="font-serif text-xs font-semibold text-[#A67C52] uppercase tracking-wide">
              Areas to Improve
            </h4>
          </div>

          {parsed.improvements.length > 0 ? (
            <ul className="space-y-2">
              {parsed.improvements.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-[#353B37] leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#858B86]">No specific revisions required.</p>
          )}
        </div>
      </div>

      {/* Expandable Raw Critic Text */}
      <div className="pt-2 border-t border-[#E2DDD1]">
        <div
          onClick={() => setShowRaw(!showRaw)}
          className="flex items-center justify-between cursor-pointer py-1 group"
        >
          <span className="text-xs font-mono text-[#858B86] group-hover:text-[#1B1F1C]">
            {showRaw ? "Hide unedited critic log" : "View unedited critic log"}
          </span>
          <button type="button" className="text-[#858B86] group-hover:text-[#1B1F1C]">
            {showRaw ? (
              <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {showRaw && (
          <div className="mt-2.5 p-3.5 rounded-[10px] bg-[#EFEBE0] border border-[#E2DDD1]">
            <pre className="text-xs font-mono text-[#1B1F1C] whitespace-pre-wrap leading-relaxed">
              {feedback || "No feedback text available."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
