"use client";

import React, { useState } from "react";
import { FileText, Globe, Award } from "lucide-react";
import ResearchReport from "./ResearchReport";
import SourcesPanel from "./SourcesPanel";
import CriticReview from "./CriticReview";
import { parseSources, parseCriticReview } from "@/lib/utils";

export default function ResearchTabs({
  report = "",
  searchResults = "",
  scrapedContent = "",
  feedback = "",
}) {
  const [activeTab, setActiveTab] = useState("report"); // 'report' | 'sources' | 'critic'

  const sources = parseSources(searchResults, scrapedContent);
  const critic = parseCriticReview(feedback);

  return (
    <div className="w-full my-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0C0D10] overflow-hidden shadow-2xl">
      {/* Navigation Tab Header */}
      <div className="flex items-center gap-1 p-2 bg-[#111318] border-b border-[rgba(255,255,255,0.06)] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("report")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeTab === "report"
              ? "bg-[#181A22] text-white shadow-sm border border-violet-500/25"
              : "text-[#9A9CA5] hover:text-[#E2E4E9] hover:bg-white/5"
          }`}
        >
          <FileText className={`w-4 h-4 ${activeTab === "report" ? "text-violet-400" : "text-[#646775]"}`} />
          <span>Research Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sources")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeTab === "sources"
              ? "bg-[#181A22] text-white shadow-sm border border-blue-500/25"
              : "text-[#9A9CA5] hover:text-[#E2E4E9] hover:bg-white/5"
          }`}
        >
          <Globe className={`w-4 h-4 ${activeTab === "sources" ? "text-blue-400" : "text-[#646775]"}`} />
          <span>Sources & Research</span>
          {sources.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/20">
              {sources.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("critic")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeTab === "critic"
              ? "bg-[#181A22] text-white shadow-sm border border-emerald-500/25"
              : "text-[#9A9CA5] hover:text-[#E2E4E9] hover:bg-white/5"
          }`}
        >
          <Award className={`w-4 h-4 ${activeTab === "critic" ? "text-emerald-400" : "text-[#646775]"}`} />
          <span>Critic Review</span>
          {critic.score !== null && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              {critic.score}/10
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "report" && <ResearchReport report={report} />}
        {activeTab === "sources" && (
          <SourcesPanel
            searchResults={searchResults}
            scrapedContent={scrapedContent}
          />
        )}
        {activeTab === "critic" && <CriticReview feedback={feedback} />}
      </div>
    </div>
  );
}

