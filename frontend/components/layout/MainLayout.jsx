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

  // Handle window resizing for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
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

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewResearch = () => {
    setActiveConversationId(null);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await deleteConversation(id);
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
      await fetchConversations();
    } catch (err) {
      alert(`Error deleting conversation: ${err.message}`);
    }
  };

  const handleConversationCreated = (newId) => {
    setActiveConversationId(newId);
    fetchConversations();
  };

  const activeTitle = conversations.find((c) => c.id === activeConversationId)?.title || "New Research";

  return (
    <div className="relative min-h-screen bg-[#070809] text-[#F5F5F5] flex overflow-x-hidden">
      {/* Ambient Atmospheric Backdrop */}
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
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
      />

      {/* Main Workspace Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile ? "lg:pl-[270px]" : "pl-0"
        }`}
      >
        <Header
          title={activeTitle}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewResearch={handleNewResearch}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 flex flex-col">
          <ChatWorkspace
            conversationId={activeConversationId}
            onConversationCreated={handleConversationCreated}
            onRefreshConversations={fetchConversations}
          />
        </main>
      </div>
    </div>
  );
}

