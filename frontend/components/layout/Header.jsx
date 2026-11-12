"use client";

import React from "react";
import { Menu, Plus, Sparkles } from "lucide-react";

export default function Header({
  title = "New Research",
  onToggleSidebar,
  onNewResearch,
  isSidebarOpen,
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#070809]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-[#9A9CA5] hover:text-white hover:bg-white/5 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <h2 className="text-sm font-semibold text-[#F5F5F5] truncate max-w-xs md:max-w-md">
            {title || "New Research"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNewResearch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#E2E4E9] hover:text-white transition-all border border-white/5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Research</span>
        </button>
      </div>
    </header>
  );
}

