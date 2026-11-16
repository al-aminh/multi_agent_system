"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
} from "lucide-react";
import { parseSources } from "@/lib/utils";

export default function SourcesPanel({
  searchResults = "",
  scrapedContent = "",
}) {
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [showFullScraped, setShowFullScraped] = useState(false);

  // Parse structured sources from search results
  const sources = parseSources(searchResults, scrapedContent);

  return (
    <div className="p-4 sm:p-6 bg-[#FBF9F4] rounded-[12px] space-y-6">
      {/* Section 1: Discovered Sources */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1F3D2F]" strokeWidth={1.5} />
            <h3 className="font-serif text-sm font-semibold text-[#1F3D2F]">
              Primary Source Materials ({sources.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#858B86]">
            Verified Documents
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="p-4 rounded-[10px] bg-[#F4F1EA] border border-[#E2DDD1] text-xs text-[#5E6460]">
            No discrete URLs extracted from search results.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-3 rounded-[10px] bg-[#F4F1EA] hover:bg-[#EFEBE0] border border-[#E2DDD1] hover:border-[#CFC8B8] transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#E9E4D8] text-[#1F3D2F] border border-[#DDD6C5]">
                      0{i + 1}
                    </span>
                    <span className="font-serif text-xs sm:text-[13px] font-medium text-[#1B1F1C] group-hover:text-[#1F3D2F] truncate">
                      {src.title}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#858B86] group-hover:text-[#1F3D2F] flex-shrink-0" strokeWidth={1.5} />
                </div>

                <div className="text-[11px] text-[#858B86] font-mono truncate mt-1">
                  {src.url}
                </div>

                {src.snippet && (
                  <p className="text-xs text-[#5E6460] mt-1.5 line-clamp-2 leading-relaxed">
                    {src.snippet}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Reader Agent Scraped Content */}
      <div className="pt-4 border-t border-[#E2DDD1]">
        <div
          onClick={() => setShowFullScraped(!showFullScraped)}
          className="flex items-center justify-between cursor-pointer py-1 group"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#A67C52]" strokeWidth={1.5} />
            <h3 className="font-serif text-sm font-semibold text-[#1F3D2F] group-hover:text-[#A67C52] transition-colors">
              Extracted Webpage Content (Reader Agent)
            </h3>
            <span className="text-[10px] font-mono text-[#858B86]">
              ({scrapedContent.length} chars)
            </span>
          </div>

          <button
            type="button"
            className="text-xs text-[#5E6460] group-hover:text-[#1B1F1C] flex items-center gap-1"
          >
            <span>{showFullScraped ? "Collapse" : "Inspect Raw Text"}</span>
            {showFullScraped ? (
              <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {showFullScraped && (
          <div className="mt-3 p-3.5 rounded-[10px] bg-[#EFEBE0] border border-[#E2DDD1] max-h-96 overflow-y-auto">
            <pre className="text-xs font-mono text-[#1B1F1C] whitespace-pre-wrap leading-relaxed">
              {scrapedContent || "No content was scraped."}
            </pre>
          </div>
        )}
      </div>

      {/* Section 3: Raw Search Output */}
      <div className="pt-4 border-t border-[#E2DDD1]">
        <div
          onClick={() => setShowFullSearch(!showFullSearch)}
          className="flex items-center justify-between cursor-pointer py-1 group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#5E6460]" strokeWidth={1.5} />
            <h3 className="font-serif text-sm font-semibold text-[#1F3D2F] group-hover:text-[#5E6460] transition-colors">
              Raw Search Output (Tavily Engine)
            </h3>
          </div>

          <button
            type="button"
            className="text-xs text-[#5E6460] group-hover:text-[#1B1F1C] flex items-center gap-1"
          >
            <span>{showFullSearch ? "Collapse" : "Inspect Search Log"}</span>
            {showFullSearch ? (
              <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {showFullSearch && (
          <div className="mt-3 p-3.5 rounded-[10px] bg-[#EFEBE0] border border-[#E2DDD1] max-h-80 overflow-y-auto">
            <pre className="text-xs font-mono text-[#1B1F1C] whitespace-pre-wrap leading-relaxed">
              {searchResults || "No search results available."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
