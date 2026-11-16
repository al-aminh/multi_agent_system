"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ChatInput({
  value = "",
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Enter an inquiry or research proposition…",
  autoFocus = false,
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
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
    <div className="w-full max-w-[720px] mx-auto px-4 sm:px-0">
      <div className="relative rounded-[8px] bg-[#FBF8F1] dark:bg-[#1C1915] border border-[#D9D2C0] dark:border-[#2C2720] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-colors focus-within:border-[#1F3D2F] dark:focus-within:border-[#B8975A] focus-within:ring-1 focus-within:ring-[#1F3D2F]/20 dark:focus-within:ring-[#B8975A]/20">
        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          placeholder={placeholder}
          className="w-full pt-3.5 pb-10 pl-4 pr-12 bg-transparent text-[#1B1F1C] dark:text-[#EDE6D8] placeholder-[#7A7566] dark:placeholder-[#8F8778] text-sm md:text-[15px] resize-none focus:outline-none leading-relaxed font-sans"
          style={{ minHeight: "54px" }}
        />

        {/* Bottom Bar: Quiet editorial hint & small circular send button */}
        <div className="absolute left-4 right-2.5 bottom-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 text-[11px] text-[#7A7566] dark:text-[#8F8778] font-serif italic">
            <span className="hidden sm:inline">
              Return to dispatch inquiry · Shift + Return for new line
            </span>
            <span className="sm:hidden">The Research Folio</span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className={`pointer-events-auto w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isSubmitDisabled
                ? "bg-[#D9D2C0]/50 dark:bg-[#2C2720] text-[#7A7566] dark:text-[#8F8778] cursor-not-allowed opacity-50"
                : "bg-[#1F3D2F] dark:bg-[#B8975A] hover:opacity-90 text-[#F3EFE6] dark:text-[#14120F] active:scale-95"
            }`}
            title="Dispatch inquiry"
            aria-label="Dispatch inquiry"
          >
            {isLoading ? (
              <span className="blinking-cursor !w-1 !h-3.5 !ml-0 bg-current" />
            ) : (
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
