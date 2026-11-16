"use client";

import React, { useState, useEffect } from "react";

export default function UserMessage({ content, createdAt }) {
  const [timeFormatted, setTimeFormatted] = useState(null);

  useEffect(() => {
    if (createdAt) {
      try {
        setTimeFormatted(
          new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch {
        // fallback
      }
    }
  }, [createdAt]);

  return (
    <div className="w-full max-w-[720px] mx-auto my-8 px-4 sm:px-0">
      <div className="border-l-2 border-[#1F3D2F] dark:border-[#B8975A] pl-4 sm:pl-5 py-0.5">
        <div className="flex items-center justify-between text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] mb-1.5">
          <span>Inquiry docket</span>
          {timeFormatted && (
            <span className="font-mono text-[10px] not-italic text-[#7A7566] dark:text-[#8F8778]">
              {timeFormatted}
            </span>
          )}
        </div>
        <div className="text-lg sm:text-xl font-serif text-[#1B1F1C] dark:text-[#EDE6D8] leading-snug">
          “{content}”
        </div>
      </div>
    </div>
  );
}
