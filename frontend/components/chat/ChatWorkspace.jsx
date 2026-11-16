"use client";

import React, { useState, useEffect, useRef } from "react";
import WelcomeScreen from "./WelcomeScreen";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import ChatInput from "./ChatInput";
import { streamResearch, getConversation } from "@/lib/api";

export default function ChatWorkspace({
  conversationId = null,
  onConversationCreated,
  onRefreshConversations,
  isSidebarOpen = true,
  isMobile = false,
  theme = "paper",
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("");

  // Live streaming states
  const [streamingStage, setStreamingStage] = useState(null);
  const [stagesState, setStagesState] = useState({});
  const [streamingError, setStreamingError] = useState(null);
  const [streamingResult, setStreamingResult] = useState(null);

  const activeStreamingConvIdRef = useRef(null);
  const currentConvIdRef = useRef(conversationId);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversation details when conversationId changes
  useEffect(() => {
    // If this conversation is currently being researched, do NOT interrupt or wipe state
    if (activeStreamingConvIdRef.current && conversationId === activeStreamingConvIdRef.current) {
      currentConvIdRef.current = conversationId;
      return;
    }

    if (isLoadingRef.current && conversationId === currentConvIdRef.current) {
      return;
    }

    currentConvIdRef.current = conversationId;

    if (!conversationId) {
      setMessages([]);
      setConversationTitle("New Inquiry");
      setStreamingStage(null);
      setStagesState({});
      setStreamingError(null);
      setStreamingResult(null);
      return;
    }

    let isMounted = true;
    async function loadConv() {
      try {
        const data = await getConversation(conversationId);
        if (isMounted && data) {
          setMessages(data.messages || []);
          setConversationTitle(data.title || "The Research Folio");
        }
      } catch (err) {
        console.error("Failed to load conversation:", err);
      }
    }

    loadConv();
    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  // Scroll to bottom when messages or stages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingStage, stagesState]);

  const handleSubmit = async (overrideTopic = null) => {
    const topic = (overrideTopic || inputValue).trim();
    if (!topic || isLoading) return;

    setInputValue("");
    setIsLoading(true);
    setStreamingError(null);
    setStreamingStage("search");
    setStagesState({});
    setStreamingResult(null);

    // Optimistically add user inquiry docket
    const tempUserMsg = {
      id: `temp-user-${Date.now()}`,
      role: "user",
      content: topic,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    let targetConversationId = conversationId;

    await streamResearch({
      topic,
      conversationId: targetConversationId,
      onEvent: (event) => {
        // Handle init event which returns the created conversation ID
        if (event.stage === "init" && event.data?.conversation_id) {
          targetConversationId = event.data.conversation_id;
          activeStreamingConvIdRef.current = targetConversationId;
          currentConvIdRef.current = targetConversationId;
          if (onConversationCreated) {
            onConversationCreated(targetConversationId);
          }
        }

        // Update live stage status
        if (event.stage && event.stage !== "init") {
          setStreamingStage(event.stage);

          setStagesState((prev) => ({
            ...prev,
            [event.stage]: {
              status: event.status,
              message: event.message,
            },
          }));

          // Capture partial data if available
          if (event.data) {
            setStreamingResult((prev) => ({
              ...(prev || {}),
              ...event.data,
            }));
          }
        }
      },
      onError: (err) => {
        setStreamingError(err);
        setIsLoading(false);
        activeStreamingConvIdRef.current = null;
      },
      onComplete: (data) => {
        const finalResult = data?.result || {};
        const asstMsg = {
          id: data?.assistant_message_id || `asst-${Date.now()}`,
          role: "assistant",
          content: finalResult.report || "",
          search_results: finalResult.search_results || "",
          scraped_content: finalResult.scraped_content || "",
          report: finalResult.report || "",
          feedback: finalResult.feedback || "",
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, asstMsg]);
        setIsLoading(false);
        setStreamingStage(null);
        setStagesState({});
        setStreamingResult(null);
        activeStreamingConvIdRef.current = null;

        if (onRefreshConversations) {
          onRefreshConversations();
        }
      },
    });
  };

  const hasMessages = messages.length > 0 || isLoading;

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen relative z-10">
      {/* Scrollable Conversation Workspace */}
      <div className="flex-1 overflow-y-auto pb-40 pt-6">
        {!hasMessages ? (
          <WelcomeScreen onSelectTopic={(t) => handleSubmit(t)} />
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => {
              if (msg.role === "user") {
                return (
                  <UserMessage
                    key={msg.id}
                    content={msg.content}
                    createdAt={msg.created_at}
                  />
                );
              }
              return (
                <AssistantMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={false}
                />
              );
            })}

            {/* Active streaming assistant message */}
            {isLoading && (
              <AssistantMessage
                isStreaming={true}
                currentStage={streamingStage}
                stagesState={stagesState}
                error={streamingError}
                message={streamingResult}
              />
            )}

            <div ref={messagesEndRef} className="h-6" />
          </div>
        )}
      </div>

      {/* Floating Bottom Input Area (No background bar or dividing line) */}
      <div
        className={`fixed bottom-0 right-0 z-20 pb-5 sm:pb-6 pointer-events-none transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile ? "left-0 lg:left-[270px]" : "left-0"
        }`}
      >
        <div className="pointer-events-auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => handleSubmit()}
            isLoading={isLoading}
            autoFocus={!hasMessages}
          />
        </div>
      </div>
    </div>
  );
}
