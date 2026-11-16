"use client";

import React, { useState } from "react";
import { FileText, Globe, Scale } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("report");

  const sources = parseSources(searchResults, scrapedContent);
  const critic = parseCriticReview(feedback);

  return (
    <div className="w-full my-3 rounded-[12px] border border-[#E2DDD1] bg-[#FBF9F4] overflow-hidden soft-card-shadow">
      {/* Navigation Tab Header */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#F4F1EA] border-b border-[#E2DDD1] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("report")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs sm:text-[13px] transition-all ${
            activeTab === "report"
              ? "bg-[#FBF9F4] text-[#1F3D2F] font-serif font-medium border border-[#E2DDD1] shadow-xs"
              : "text-[#5E6460] hover:text-[#1B1F1C] hover:bg-[#EAE5D8]"
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${activeTab === "report" ? "text-[#1F3D2F]" : "text-[#858B86]"}`} strokeWidth={1.5} />
          <span>Research Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sources")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs sm:text-[13px] transition-all ${
            activeTab === "sources"
              ? "bg-[#FBF9F4] text-[#1F3D2F] font-serif font-medium border border-[#E2DDD1] shadow-xs"
              : "text-[#5E6460] hover:text-[#1B1F1C] hover:bg-[#EAE5D8]"
          }`}
        >
          <Globe className={`w-3.5 h-3.5 ${activeTab === "sources" ? "text-[#1F3D2F]" : "text-[#858B86]"}`} strokeWidth={1.5} />
          <span>Sources & Evidence</span>
          {sources.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-mono bg-[#E9E4D8] text-[#1F3D2F] border border-[#DDD6C5]">
              {sources.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("critic")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs sm:text-[13px] transition-all ${
            activeTab === "critic"
              ? "bg-[#FBF9F4] text-[#1F3D2F] font-serif font-medium border border-[#E2DDD1] shadow-xs"
              : "text-[#5E6460] hover:text-[#1B1F1C] hover:bg-[#EAE5D8]"
          }`}
        >
          <Scale className={`w-3.5 h-3.5 ${activeTab === "critic" ? "text-[#1F3D2F]" : "text-[#858B86]"}`} strokeWidth={1.5} />
          <span>Editorial Appraisal</span>
          {critic.score !== null && (
            <span className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-mono bg-[#E9E4D8] text-[#1F3D2F] border border-[#DDD6C5]">
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
