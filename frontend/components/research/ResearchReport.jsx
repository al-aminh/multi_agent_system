"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Download, FileText, Clock } from "lucide-react";

export default function ResearchReport({ report = "" }) {
  const [copied, setCopied] = useState(false);

  // Approximate reading time
  const wordCount = report ? report.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Research_Report_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!report) {
    return (
      <div className="p-8 text-center text-[#858B86] font-serif text-sm">
        No report generated yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Action and meta toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#F4F1EA] border-b border-[#E2DDD1] rounded-t-[12px]">
        <div className="flex items-center gap-4 text-xs text-[#5E6460]">
          <div className="flex items-center gap-1.5 font-mono">
            <FileText className="w-3.5 h-3.5 text-[#1F3D2F]" strokeWidth={1.5} />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#A67C52]" strokeWidth={1.5} />
            <span>~{readTimeMinutes} min read</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FBF9F4] hover:bg-[#EFEBE0] text-xs font-medium text-[#1B1F1C] transition-colors border border-[#E2DDD1]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1F3D2F]" strokeWidth={2} />
                <span className="text-[#1F3D2F] font-mono text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#5E6460]" strokeWidth={1.5} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FBF9F4] hover:bg-[#EFEBE0] text-xs font-medium text-[#1B1F1C] transition-colors border border-[#E2DDD1]"
          >
            <Download className="w-3.5 h-3.5 text-[#5E6460]" strokeWidth={1.5} />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Markdown Content Area */}
      <div className="p-5 sm:p-8 bg-[#FBF9F4] rounded-b-[12px] overflow-x-auto">
        <div className="markdown-body max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1F3D2F] hover:text-[#A67C52] underline underline-offset-3 font-medium"
                />
              ),
            }}
          >
            {report}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
