"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  X,
  PanelLeftClose,
  Moon,
  Sun,
} from "lucide-react";
import MonogramLogo from "./MonogramLogo";
import { groupConversations } from "@/lib/utils";

export default function Sidebar({
  conversations = [],
  activeConversationId = null,
  onSelectConversation,
  onNewResearch,
  onDeleteConversation,
  backendStatus = "checking",
  isOpen = true,
  onToggleOpen,
  isMobile = false,
  theme = "paper",
  onToggleTheme,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const isDark = theme === "ink";

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => (c.title || "").toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  // Group filtered conversations
  const groups = useMemo(() => {
    return groupConversations(filteredConversations);
  }, [filteredConversations]);

  const handleDelete = async (e, convId) => {
    e.stopPropagation();
    if (confirm("Remove this research inquiry from the archive?")) {
      setDeletingId(convId);
      try {
        await onDeleteConversation(convId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const renderGroup = (label, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="px-3 text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] mb-2">
          {label}
        </h3>
        <div className="space-y-0.5">
          {items.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isDeleting = conv.id === deletingId;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-[6px] text-xs cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-[#DFD9CA] dark:bg-[#25211B] text-[#1F3D2F] dark:text-[#B8975A] font-medium"
                    : "text-[#1B1F1C] dark:text-[#EDE6D8] hover:bg-[#E3DDCF] dark:hover:bg-[#201C17]"
                } ${isDeleting ? "opacity-30 pointer-events-none" : ""}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                  <span
                    className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${
                      isActive
                        ? "bg-[#1F3D2F] dark:bg-[#B8975A]"
                        : "bg-transparent group-hover:bg-[#A67C52] dark:group-hover:bg-[#B8975A]"
                    }`}
                  />
                  <span className="truncate font-serif text-[13px] leading-snug">
                    {conv.title || "Untitled Inquiry"}
                  </span>
                </div>

                <button
                  type="button"
                  title="Remove from archive"
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-700 text-[#7A7566] dark:text-[#8F8778] transition-opacity flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={1.25} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={onToggleOpen}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#EBE6D9] dark:bg-[#1C1915] border-r border-[#D9D2C0] dark:border-[#2C2720] transition-all duration-300 ease-in-out ${
          isMobile ? "w-[285px] max-w-[85vw] shadow-2xl" : "w-[270px]"
        } ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none invisible overflow-hidden"
        }`}
      >
        {/* Top Publication Header & Custom Monogram */}
        <div className="p-4 flex items-center justify-between border-b border-[#D9D2C0] dark:border-[#2C2720]">
          <div className="flex items-center gap-2.5">
            <MonogramLogo className="w-6 h-6 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-base tracking-tight text-[#1F3D2F] dark:text-[#EDE6D8]">
                  <em>The</em> Research Folio
                </span>
              </div>
              <p className="text-[11px] font-serif italic text-[#7A7566] dark:text-[#8F8778]">
                Private library edition
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 rounded-[6px] text-[#7A7566] dark:text-[#8F8778] hover:text-[#1B1F1C] dark:hover:text-[#EDE6D8] transition-colors"
            title="Collapse drawer"
            aria-label="Collapse Sidebar"
          >
            {isMobile ? (
              <X className="w-4 h-4" strokeWidth={1.25} />
            ) : (
              <PanelLeftClose className="w-4 h-4" strokeWidth={1.25} />
            )}
          </button>
        </div>

        {/* Action: New Inquiry */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewResearch();
              if (isMobile) onToggleOpen();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[6px] bg-[#1F3D2F] dark:bg-[#B8975A] text-[#F3EFE6] dark:text-[#14120F] text-xs font-medium hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.25} />
            <span>New Inquiry</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search
              className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7566] dark:text-[#8F8778]"
              strokeWidth={1.25}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F3EFE6] dark:bg-[#14120F] text-[#1B1F1C] dark:text-[#EDE6D8] placeholder-[#7A7566] dark:placeholder-[#8F8778] rounded-[6px] text-xs border border-[#D9D2C0] dark:border-[#2C2720] focus:outline-none focus:border-[#1F3D2F] dark:focus:border-[#B8975A] transition-colors"
            />
          </div>
        </div>

        {/* Archive History List */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {conversations.length === 0 ? (
            <div className="px-3 py-12 text-center">
              <BookOpen
                className="w-5 h-5 text-[#A67C52] dark:text-[#B8975A] mx-auto mb-2 opacity-60"
                strokeWidth={1.25}
              />
              <p className="font-serif italic text-xs text-[#7A7566] dark:text-[#8F8778]">
                Archive is currently empty.
              </p>
              <p className="text-[11px] text-[#7A7566] dark:text-[#8F8778] mt-0.5">
                Begin an inquiry to document findings.
              </p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778]">
              No matching records found.
            </div>
          ) : (
            <>
              {renderGroup("Recent inquiries", groups.today)}
              {renderGroup("Past seven days", groups.previous7Days)}
              {renderGroup("Archived prior", groups.older)}
            </>
          )}
        </div>

        {/* Colophon & Theme Switcher */}
        <div className="p-3 border-t border-[#D9D2C0] dark:border-[#2C2720] bg-[#E5DFD0] dark:bg-[#181512] text-xs space-y-2">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-1">
            <span className="font-serif italic text-[11px] text-[#7A7566] dark:text-[#8F8778]">
              Theme
            </span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 text-[11px] font-serif text-[#1F3D2F] dark:text-[#B8975A] hover:underline cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3 h-3 text-[#B8975A]" strokeWidth={1.25} />
                  <span>Warm Paper</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-[#A67C52]" strokeWidth={1.25} />
                  <span>Ink & Brass</span>
                </>
              )}
            </button>
          </div>

          {/* System status */}
          <div className="flex items-center justify-between px-1 text-[11px] text-[#7A7566] dark:text-[#8F8778] pt-1 border-t border-[#D9D2C0]/50 dark:border-[#2C2720]">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === "online"
                    ? "bg-[#1F3D2F] dark:bg-[#B8975A]"
                    : backendStatus === "checking"
                    ? "bg-[#A67C52]"
                    : "bg-[#8F3B3B]"
                }`}
              />
              <span>
                {backendStatus === "online"
                  ? "Archive active"
                  : backendStatus === "checking"
                  ? "Connecting…"
                  : "Offline"}
              </span>
            </div>
            <span className="font-mono text-[10px]">Groq · SQLite</span>
          </div>
        </div>
      </aside>
    </>
  );
}
