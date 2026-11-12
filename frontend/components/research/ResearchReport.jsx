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
      <div className="p-8 text-center text-[#646775]">
        No report generated yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Action and meta toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#13151D] border-b border-[rgba(255,255,255,0.06)] rounded-t-xl">
        <div className="flex items-center gap-4 text-xs text-[#8E909B]">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>~{readTimeMinutes} min read</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#D1D5DB] hover:text-white transition-colors border border-white/5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#D1D5DB] hover:text-white transition-colors border border-white/5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Markdown Content Area */}
      <div className="p-6 md:p-8 bg-[#0F1117] rounded-b-xl overflow-x-auto">
        <div className="markdown-body max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
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

