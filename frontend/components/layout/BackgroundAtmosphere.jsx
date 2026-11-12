"use client";

import React from "react";

export default function BackgroundAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep atmospheric backdrop */}
      <div className="absolute inset-0 bg-[#070809]" />

      {/* Soft atmospheric radial glows */}
      <div 
        className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full opacity-20 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #6366F1 0%, #8B5CF6 45%, transparent 70%)",
        }}
      />
      <div 
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-15 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, #8B5CF6 50%, transparent 70%)",
        }}
      />
      <div 
        className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] rounded-full opacity-15 blur-[150px]"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #1E1B4B 60%, transparent 80%)",
        }}
      />

      {/* Subtle vignette layer */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at center, transparent 0%, rgba(7, 8, 9, 0.6) 100%)",
        }}
      />
    </div>
  );
}

