"use client";

import React from "react";

export default function MonogramLogo({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="The Research Folio Monogram"
    >
      {/* Outer geometric frame */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        className="stroke-[#1F3D2F] dark:stroke-[#B8975A]"
        strokeWidth="1.25"
      />
      {/* Architectural folio monogram: R & leaf stem */}
      <path
        d="M7.5 7H12.5C14.4 7 15.8 8.2 15.8 9.8C15.8 11.4 14.4 12.6 12.5 12.6H7.5V7Z"
        className="stroke-[#1F3D2F] dark:stroke-[#B8975A]"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.6L16 17"
        className="stroke-[#1F3D2F] dark:stroke-[#B8975A]"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Signature brass dot */}
      <circle
        cx="16.5"
        cy="7.5"
        r="1"
        className="fill-[#A67C52] dark:fill-[#B8975A]"
      />
    </svg>
  );
}
