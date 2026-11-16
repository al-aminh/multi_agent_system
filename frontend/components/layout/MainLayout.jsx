"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BackgroundAtmosphere from "./BackgroundAtmosphere";
import ChatWorkspace from "@/components/chat/ChatWorkspace";
import { getConversations, deleteConversation, checkHealth } from "@/lib/api";

export default function MainLayout() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [theme, setTheme] = useState("paper");

  // Load and apply theme ("paper" or "ink")
  useEffect(() => {
    const saved = localStorage.getItem("research_theme") || "paper";
    setTheme(saved);
    if (saved === "ink") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "paper" ? "ink" : "paper";
      localStorage.setItem("research_theme", next);
      if (next === "ink") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  // Handle window resizing for responsive sidebar
  useEffect(() => {
    let wasMobile = window.innerWidth < 1024;
    setIsMobile(wasMobile);
    if (wasMobile) {
      setIsSidebarOpen(false);
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && !wasMobile) {
        setIsSidebarOpen(false);
      }
      wasMobile = mobile;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check backend health
  const verifyBackend = useCallback(async () => {
    try {
      const health = await checkHealth();
      if (health.status === "healthy") {
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }
    } catch {
      setBackendStatus("offline");
    }
  }, []);

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, []);

  useEffect(() => {
    verifyBackend();
    fetchConversations();

    // Periodic health check every 30 seconds
    const interval = setInterval(verifyBackend, 30000);
    return () => clearInterval(interval);
  }, [verifyBackend, fetchConversations]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleSelectConversation = useCallback((id) => {
    setActiveConversationId(id);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleNewResearch = useCallback(() => {
    setActiveConversationId(null);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleDeleteConversation = useCallback(
    async (id) => {
      try {
        await deleteConversation(id);
        setActiveConversationId((prev) => (prev === id ? null : prev));
        await fetchConversations();
      } catch (err) {
        alert(`Error removing inquiry: ${err.message}`);
      }
    },
    [fetchConversations]
  );

  const handleConversationCreated = useCallback(
    (newId) => {
      setActiveConversationId(newId);
      fetchConversations();
    },
    [fetchConversations]
  );

  const activeTitle =
    conversations.find((c) => c.id === activeConversationId)?.title ||
    "The Research Folio";

  return (
    <div className={`relative min-h-screen bg-[#F3EFE6] dark:bg-[#14120F] text-[#1B1F1C] dark:text-[#EDE6D8] flex overflow-x-hidden ${theme === "ink" ? "dark" : ""}`}>
      {/* Ambient Atmospheric Backdrop: pure paper grain noise, 0 grid lines, 0 glow */}
      <BackgroundAtmosphere />

      {/* Collapsible Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewResearch={handleNewResearch}
        onDeleteConversation={handleDeleteConversation}
        backendStatus={backendStatus}
        isOpen={isSidebarOpen}
        onToggleOpen={handleToggleSidebar}
        isMobile={isMobile}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile ? "lg:pl-[270px]" : "pl-0"
        }`}
      >
        <Header
          title={activeTitle}
          onToggleSidebar={handleToggleSidebar}
          onNewResearch={handleNewResearch}
          isSidebarOpen={isSidebarOpen}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        <main className="flex-1 flex flex-col">
          <ChatWorkspace
            conversationId={activeConversationId}
            onConversationCreated={handleConversationCreated}
            onRefreshConversations={fetchConversations}
            isSidebarOpen={isSidebarOpen}
            isMobile={isMobile}
            theme={theme}
          />
        </main>
      </div>
    </div>
  );
}
