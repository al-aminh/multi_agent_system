"use client";

import React from "react";

export default function BackgroundAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Warm paper background base */}
      <div className="absolute inset-0 bg-[#F3EFE6] dark:bg-[#14120F] transition-colors duration-200" />

      {/* 3% faint paper-grain noise (pure SVG feTurbulence, no external assets, no grid lines, no glow) */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
