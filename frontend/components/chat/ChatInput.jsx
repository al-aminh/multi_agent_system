"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";

export default function ChatInput({
  value = "",
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Enter a research topic you want to investigate...",
  autoFocus = false,
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const isSubmitDisabled = !value.trim() || isLoading;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="relative rounded-2xl bg-[#111318]/90 backdrop-blur-xl border border-[rgba(255,255,255,0.09)] shadow-xl transition-all duration-200 glow-focus">
        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          placeholder={placeholder}
          className="w-full pt-4 pb-12 pl-4 pr-14 bg-transparent text-[#F5F5F5] placeholder-[#646775] text-sm md:text-base resize-none focus:outline-none leading-relaxed"
          style={{ minHeight: "64px" }}
        />

        {/* Bottom Bar: Hints & Submit Button */}
        <div className="absolute left-4 right-3 bottom-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 text-[11px] text-[#646775]">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span className="hidden sm:inline">Enter to research • Shift + Enter for new line</span>
            <span className="sm:hidden">Multi-agent research</span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className={`pointer-events-auto w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isSubmitDisabled
                ? "bg-white/5 text-[#555866] cursor-not-allowed"
                : "bg-gradient-to-tr from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white shadow-md shadow-violet-900/40 glow-btn scale-100 active:scale-95"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

