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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversation details when conversationId changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setConversationTitle("New Research");
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
          setConversationTitle(data.title || "Research Conversation");
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

    // Optimistically add user message
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
      <div className="flex-1 overflow-y-auto pb-44 pt-4">
        {!hasMessages ? (
          <WelcomeScreen onSelectTopic={(t) => handleSubmit(t)} />
        ) : (
          <div className="space-y-4">
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

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Sticky Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pb-5 pt-3 bg-gradient-to-t from-[#070809] via-[#070809]/95 to-transparent pointer-events-none">
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

