"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Cpu,
  Radio,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
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
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
    if (confirm("Delete this research conversation?")) {
      setDeletingId(convId);
      try {
        await onDeleteConversation(convId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const renderGroup = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-5">
        <h3 className="px-3 text-[11px] font-semibold tracking-wider text-[#646775] uppercase mb-1.5 font-mono">
          {title}
        </h3>
        <div className="space-y-0.5">
          {items.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isDeleting = conv.id === deletingId;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-[#171922] text-[#FFFFFF] shadow-sm border border-violet-500/25"
                    : "text-[#9A9CA5] hover:text-[#E2E4E9] hover:bg-[#12141A]"
                } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                  <MessageSquare
                    className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                      isActive ? "text-violet-400" : "text-[#646775] group-hover:text-[#9A9CA5]"
                    }`}
                  />
                  <span className="truncate text-[13px] font-medium">
                    {conv.title || "Untitled Research"}
                  </span>
                </div>

                <button
                  type="button"
                  title="Delete conversation"
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/15 hover:text-red-400 text-[#646775] transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-violet-500 rounded-r" />
                )}
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={onToggleOpen}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0C0D10] border-r border-[rgba(255,255,255,0.07)] transition-all duration-300 ease-in-out ${
          isOpen ? "w-[270px] translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-none"
        } ${isMobile ? "w-[290px]" : ""}`}
      >
        {/* Top Header & Brand */}
        <div className="p-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-[1px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#0C0D10] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white">
                  Research AI
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20 font-medium">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-[#646775]">Multi-Agent Workspace</p>
            </div>
          </div>

          {isMobile && (
            <button
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg text-[#9A9CA5] hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Button: New Research */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewResearch();
              if (isMobile) onToggleOpen();
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-sm shadow-violet-950/40 border border-violet-400/25 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Research</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#646775]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#12141A] rounded-lg text-xs text-[#E2E4E9] placeholder-[#646775] border border-[rgba(255,255,255,0.06)] focus:outline-none focus:border-violet-500/40 transition-colors"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {conversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="w-6 h-6 text-[#353842] mx-auto mb-2" />
              <p className="text-xs text-[#646775]">No conversations yet</p>
              <p className="text-[11px] text-[#484B57] mt-0.5">Start your first research above</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[#646775]">
              No matches found
            </div>
          ) : (
            <>
              {renderGroup("Today", groups.today)}
              {renderGroup("Previous 7 Days", groups.previous7Days)}
              {renderGroup("Older", groups.older)}
            </>
          )}
        </div>

        {/* Bottom Status / System Info */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.06)] bg-[#090A0D] text-xs">
          <div className="flex items-center justify-between text-[#9A9CA5] px-1 py-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === "online"
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : backendStatus === "checking"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-red-400"
                }`}
              />
              <span className="text-[11px] font-medium">
                {backendStatus === "online"
                  ? "Backend Connected"
                  : backendStatus === "checking"
                  ? "Connecting..."
                  : "Backend Offline"}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#646775]">LangChain</span>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#555866] px-1">
            <span>Engine: Groq + Tavily</span>
            <span>SQLite v3</span>
          </div>
        </div>
      </aside>
    </>
  );
}

