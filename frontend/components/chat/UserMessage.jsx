"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

export default function UserMessage({ content, createdAt }) {
  const [timeFormatted, setTimeFormatted] = useState(null);

  useEffect(() => {
    if (createdAt) {
      try {
        setTimeFormatted(
          new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } catch {
        // fallback
      }
    }
  }, [createdAt]);

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4 flex items-start justify-end gap-3">
      <div className="max-w-[85%] flex flex-col items-end">
        <div className="p-4 rounded-2xl bg-[#171922] text-[#F3F4F6] text-sm md:text-base leading-relaxed border border-[rgba(255,255,255,0.08)] shadow-md">
          {content}
        </div>
        {timeFormatted && (
          <span className="text-[10px] text-[#646775] mt-1.5 px-1 font-mono">
            {timeFormatted}
          </span>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 flex-shrink-0 mt-0.5">
        <User className="w-4 h-4" />
      </div>
    </div>
  );
}
