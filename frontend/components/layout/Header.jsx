"use client";

import React from "react";
import { PanelLeft, PanelLeftClose, Plus, Moon, Sun } from "lucide-react";

export default function Header({
  title = "Research Workspace",
  onToggleSidebar,
  onNewResearch,
  isSidebarOpen = true,
  theme = "paper",
  onToggleTheme,
}) {
  const isDark = theme === "ink";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[#F3EFE6] dark:bg-[#14120F] border-b border-[#D9D2C0] dark:border-[#2C2720] transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-[6px] text-[#7A7566] dark:text-[#8F8778] hover:text-[#1B1F1C] dark:hover:text-[#EDE6D8] hover:bg-[#EBE6D9] dark:hover:bg-[#1C1915] transition-colors"
          title={isSidebarOpen ? "Collapse drawer" : "Open drawer"}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" strokeWidth={1.25} />
          ) : (
            <PanelLeft className="w-4 h-4" strokeWidth={1.25} />
          )}
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] dark:bg-[#B8975A] flex-shrink-0" />
          <h2 className="text-sm font-serif italic text-[#1B1F1C] dark:text-[#EDE6D8] truncate max-w-xs md:max-w-md">
            {title === "Research Workspace" || !title ? "The Research Folio" : title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Theme ("Ink & Brass") Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] hover:text-[#1B1F1C] dark:hover:text-[#EDE6D8] border border-[#D9D2C0] dark:border-[#2C2720] hover:border-[#1F3D2F]/40 dark:hover:border-[#B8975A]/40 transition-colors"
          title={isDark ? "Switch to Warm Paper" : "Switch to Ink & Brass"}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-[#B8975A]" strokeWidth={1.25} />
              <span className="hidden sm:inline">Paper</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#A67C52]" strokeWidth={1.25} />
              <span className="hidden sm:inline">Ink & Brass</span>
            </>
          )}
        </button>

        {/* New Inquiry Button */}
        <button
          type="button"
          onClick={onNewResearch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#1F3D2F] dark:bg-[#B8975A] text-[#F3EFE6] dark:text-[#14120F] text-xs font-medium hover:opacity-90 active:scale-[0.99] transition-all"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.25} />
          <span className="hidden sm:inline">New Inquiry</span>
        </button>
      </div>
    </header>
  );
}
