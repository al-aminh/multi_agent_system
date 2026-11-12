"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Globe,
  FileCode,
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
    <div className="p-4 md:p-6 bg-[#0F1117] rounded-xl space-y-6">
      {/* Section 1: Discovered Sources */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Identified Sources & References ({sources.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#646775]">
            Verified URLs
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="p-4 rounded-lg bg-[#12141A] border border-[rgba(255,255,255,0.06)] text-xs text-[#8A8D9B]">
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
                className="group flex flex-col p-3 rounded-lg bg-[#12141A] hover:bg-[#161822] border border-[rgba(255,255,255,0.06)] hover:border-blue-500/30 transition-all duration-150"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      0{i + 1}
                    </span>
                    <span className="text-xs font-medium text-[#E2E4E9] group-hover:text-blue-300 truncate">
                      {src.title}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#646775] group-hover:text-blue-400 flex-shrink-0" />
                </div>

                <div className="text-[11px] text-[#646775] font-mono truncate mt-1">
                  {src.url}
                </div>

                {src.snippet && (
                  <p className="text-xs text-[#8E909B] mt-1.5 line-clamp-2 leading-relaxed">
                    {src.snippet}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Reader Agent Scraped Content */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div
          onClick={() => setShowFullScraped(!showFullScraped)}
          className="flex items-center justify-between cursor-pointer py-1 group"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Scraped Webpage Content (Reader Agent)
            </h3>
            <span className="text-[11px] text-[#646775]">
              ({scrapedContent.length} chars)
            </span>
          </div>

          <button
            type="button"
            className="text-xs text-[#646775] group-hover:text-[#9A9CA5] flex items-center gap-1"
          >
            <span>{showFullScraped ? "Collapse" : "Inspect Raw Scrape"}</span>
            {showFullScraped ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {showFullScraped && (
          <div className="mt-3 p-4 rounded-lg bg-[#0C0D10] border border-[rgba(255,255,255,0.06)] max-h-96 overflow-y-auto">
            <pre className="text-xs font-mono text-[#A1A4B0] whitespace-pre-wrap leading-relaxed">
              {scrapedContent || "No content was scraped."}
            </pre>
          </div>
        )}
      </div>

      {/* Section 3: Raw Search Output */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div
          onClick={() => setShowFullSearch(!showFullSearch)}
          className="flex items-center justify-between cursor-pointer py-1 group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
              Raw Search Output (Tavily)
            </h3>
          </div>

          <button
            type="button"
            className="text-xs text-[#646775] group-hover:text-[#9A9CA5] flex items-center gap-1"
          >
            <span>{showFullSearch ? "Collapse" : "Inspect Raw Search"}</span>
            {showFullSearch ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {showFullSearch && (
          <div className="mt-3 p-4 rounded-lg bg-[#0C0D10] border border-[rgba(255,255,255,0.06)] max-h-80 overflow-y-auto">
            <pre className="text-xs font-mono text-[#A1A4B0] whitespace-pre-wrap leading-relaxed">
              {searchResults || "No search results available."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

