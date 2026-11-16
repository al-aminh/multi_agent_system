"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Download, ChevronDown, ChevronUp, Scale } from "lucide-react";
import { parseSources, parseCriticReview } from "@/lib/utils";

export default function ResearchArticle({
  report = "",
  searchResults = "",
  scrapedContent = "",
  feedback = "",
}) {
  const [copied, setCopied] = useState(false);
  const [showFieldNotes, setShowFieldNotes] = useState(false);

  const sources = parseSources(searchResults, scrapedContent);
  const critic = parseCriticReview(feedback);

  // Parse title and body from markdown
  let headline = "Research Inquiry Dispatch";
  let articleMarkdown = report;

  const titleMatch = report.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    headline = titleMatch[1].replace(/[*_#]/g, "").trim();
    // Remove the h1 from the body to avoid duplicating the headline
    articleMarkdown = report.replace(/^#\s+.+$/m, "").trim();
  }

  // Word count and reading time
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
    link.download = `${headline.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40)}_Folio.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="w-full max-w-[720px] mx-auto my-6 px-4 sm:px-0">
      {/* Article Publication Header */}
      <div className="pb-6 mb-8 border-b border-[#D9D2C0] dark:border-[#2C2720]">
        {/* Folio Metadata Line */}
        <div className="flex items-center justify-between text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] mb-3">
          <span>The Research Folio · Monograph</span>
          <div className="flex items-center gap-3 not-italic font-mono text-[11px]">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>~{readTimeMinutes} min read</span>
          </div>
        </div>

        {/* Serif Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#1F3D2F] dark:text-[#EDE6D8] tracking-tight leading-tight mb-4">
          {headline}
        </h1>

        {/* Action toolbar (quiet text links, not bulky buttons) */}
        <div className="flex items-center gap-4 text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="hover:text-[#1F3D2F] dark:hover:text-[#B8975A] transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1F3D2F] dark:text-[#B8975A]" strokeWidth={1.5} />
                <span className="not-italic text-[11px] font-mono text-[#1F3D2F] dark:text-[#B8975A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" strokeWidth={1.25} />
                <span>Copy text</span>
              </>
            )}
          </button>

          <span>·</span>

          <button
            type="button"
            onClick={handleDownload}
            className="hover:text-[#1F3D2F] dark:hover:text-[#B8975A] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" strokeWidth={1.25} />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      {/* Article Body */}
      <div className="article-prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Style H2 headings
            h2: ({ node, children, ...props }) => {
              const text = String(children);
              const isKeyFindings = text.toLowerCase().includes("finding");
              return (
                <h2
                  {...props}
                  className={isKeyFindings ? "text-[#1F3D2F] dark:text-[#EDE6D8] mt-8 mb-4" : ""}
                >
                  {children}
                </h2>
              );
            },
            // Key findings or blockquotes styled in pull-quote style
            blockquote: ({ node, ...props }) => (
              <blockquote className="pull-quote" {...props} />
            ),
            // Custom styling for links / footnote citations
            a: ({ node, href, children, ...props }) => {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1F3D2F] dark:text-[#B8975A] underline underline-offset-3 decoration-[#A67C52]/40 hover:decoration-[#1F3D2F] transition-all"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            // Style unordered lists with tiny brass markers
            ul: ({ node, ...props }) => (
              <ul className="space-y-2 my-4 pl-4 list-none" {...props} />
            ),
            li: ({ node, children, ...props }) => (
              <li className="relative pl-4" {...props}>
                <span className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full bg-[#A67C52] dark:bg-[#B8975A]" />
                <span>{children}</span>
              </li>
            ),
          }}
        >
          {articleMarkdown}
        </ReactMarkdown>
      </div>

      {/* Numbered Footnote Citations Section */}
      {sources.length > 0 && (
        <section className="mt-14 pt-6 border-t border-[#D9D2C0] dark:border-[#2C2720]">
          <h3 className="font-serif italic text-xs text-[#7A7566] dark:text-[#8F8778] mb-4">
            Sources & primary citations
          </h3>

          <ol className="space-y-2.5 text-xs font-serif">
            {sources.map((src, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-[#A67C52] dark:text-[#B8975A] flex-shrink-0">
                  [{i + 1}]
                </span>
                <div className="min-w-0 flex-1">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1F3D2F] dark:text-[#B8975A] hover:underline"
                  >
                    {src.title}
                  </a>
                  {src.url && (
                    <span className="font-mono text-[10px] text-[#7A7566] dark:text-[#8F8778] ml-2 truncate inline-block max-w-xs align-bottom">
                      — {new URL(src.url).hostname.replace("www.", "")}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Editorial Appraisal (Critic Review Colophon) */}
      {feedback && (
        <section className="mt-12 p-5 sm:p-6 rounded-[8px] border border-[#D9D2C0] dark:border-[#2C2720] bg-[#EBE6D9]/50 dark:bg-[#1C1915]/60">
          <div className="flex items-baseline justify-between mb-3 border-b border-[#D9D2C0] dark:border-[#2C2720] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] dark:bg-[#B8975A]" />
              <h3 className="font-serif italic text-xs text-[#7A7566] dark:text-[#8F8778]">
                Editorial review colophon
              </h3>
            </div>
            {critic.score !== null && (
              <div className="font-serif text-sm text-[#1F3D2F] dark:text-[#EDE6D8]">
                Rating: <span className="font-medium text-[#A67C52] dark:text-[#B8975A]">{critic.score}</span> / 10
              </div>
            )}
          </div>

          {critic.verdict && (
            <p className="font-serif italic text-sm text-[#1B1F1C] dark:text-[#EDE6D8] my-3 leading-relaxed">
              “{critic.verdict}”
            </p>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-[#D9D2C0]/60 dark:border-[#2C2720]">
            {critic.strengths.length > 0 && (
              <div>
                <h4 className="font-serif text-xs font-medium text-[#1F3D2F] dark:text-[#EDE6D8] mb-2">
                  Noted strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-[#5E6460] dark:text-[#A8A192]">
                  {critic.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#1F3D2F] dark:bg-[#B8975A] mt-1.5 flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {critic.improvements.length > 0 && (
              <div>
                <h4 className="font-serif text-xs font-medium text-[#A67C52] dark:text-[#B8975A] mb-2">
                  Areas for expansion
                </h4>
                <ul className="space-y-1.5 text-xs text-[#5E6460] dark:text-[#A8A192]">
                  {critic.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#A67C52] dark:bg-[#B8975A] mt-1.5 flex-shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Collapsible raw field notes */}
          {scrapedContent && (
            <div className="mt-4 pt-3 border-t border-[#D9D2C0]/50 dark:border-[#2C2720]">
              <button
                type="button"
                onClick={() => setShowFieldNotes(!showFieldNotes)}
                className="text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] hover:text-[#1B1F1C] dark:hover:text-[#EDE6D8] flex items-center gap-1 cursor-pointer"
              >
                <span>{showFieldNotes ? "Hide reader field notes" : "Inspect raw reader transcript"}</span>
                {showFieldNotes ? (
                  <ChevronUp className="w-3 h-3" strokeWidth={1.25} />
                ) : (
                  <ChevronDown className="w-3 h-3" strokeWidth={1.25} />
                )}
              </button>

              {showFieldNotes && (
                <div className="mt-3 p-3 rounded-[6px] bg-[#F3EFE6] dark:bg-[#14120F] border border-[#D9D2C0] dark:border-[#2C2720] max-h-72 overflow-y-auto">
                  <pre className="text-xs font-mono text-[#1B1F1C] dark:text-[#EDE6D8] whitespace-pre-wrap leading-relaxed">
                    {scrapedContent}
                  </pre>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </article>
  );
}
