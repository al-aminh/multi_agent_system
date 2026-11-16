"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  {
    label: "Artificial intelligence in clinical diagnosis & medical imaging",
    query: "Applications of machine learning and AI in clinical diagnosis and healthcare",
  },
  {
    label: "Recent architectural breakthroughs in brain-computer interfaces",
    query: "Recent developments and clinical trials in brain-computer interfaces",
  },
  {
    label: "Commercial timelines and chemistry for solid-state battery technology",
    query: "Current progress and commercial timeline for solid-state battery technology",
  },
  {
    label: "Autonomous coding agents and software verification architectures",
    query: "The impact of autonomous generative AI agents on software engineering and verification",
  },
];

const STEPS = [
  { title: "Search", desc: "Tavily retrieval" },
  { title: "Read", desc: "Verbatim parsing" },
  { title: "Synthesize", desc: "Structured report" },
  { title: "Review", desc: "Editorial appraisal" },
];

export default function WelcomeScreen({ onSelectTopic }) {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center text-center">
      {/* Editorial Heading with one word in italic */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-[#1F3D2F] dark:text-[#EDE6D8] leading-tight max-w-xl">
        What subject shall we <em>examine</em> today?
      </h1>

      {/* Signature detail: Thin brass underline beneath heading */}
      <div className="w-12 h-[1px] bg-[#A67C52] dark:bg-[#B8975A] mt-5 mb-6 opacity-75" />

      {/* Quiet editorial subtitle */}
      <p className="text-sm sm:text-[15px] font-serif italic text-[#7A7566] dark:text-[#8F8778] max-w-md mx-auto mb-12 leading-relaxed">
        Select a proposition or enter an original inquiry to begin primary retrieval, deep document reading, and peer editorial review.
      </p>

      {/* Suggested Inquiries: Typographic list with hairline dividers, no numbers, no card boxes */}
      <div className="w-full mb-16 text-left">
        <div className="text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] mb-3">
          Suggested inquiries
        </div>
        <div className="border-t border-[#D9D2C0] dark:border-[#2C2720]">
          {SUGGESTIONS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTopic(item.query)}
              className="group py-3.5 border-b border-[#D9D2C0] dark:border-[#2C2720] flex items-center justify-between cursor-pointer transition-colors duration-200"
            >
              <span className="font-serif text-sm sm:text-[15px] text-[#1B1F1C] dark:text-[#EDE6D8] group-hover:text-[#1F3D2F] dark:group-hover:text-[#B8975A] transition-colors pr-4">
                {item.label}
              </span>
              <ArrowRight
                className="w-3.5 h-3.5 opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 text-[#1F3D2F] dark:text-[#B8975A] transition-all duration-200 flex-shrink-0"
                strokeWidth={1.25}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline methodology: Single horizontal line of 4 steps joined by a thin line, no icon boxes */}
      <div className="w-full text-left pt-6">
        <div className="text-xs font-serif italic text-[#7A7566] dark:text-[#8F8778] mb-6">
          Research methodology
        </div>

        <div className="relative w-full">
          {/* Thin continuous horizontal line */}
          <div className="absolute top-[5px] left-3 right-3 h-[1px] bg-[#D9D2C0] dark:bg-[#2C2720]" />

          {/* 4 Steps */}
          <div className="relative flex items-start justify-between">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-[#F3EFE6] dark:bg-[#14120F] px-2 z-10"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#1F3D2F] dark:bg-[#B8975A] mb-2.5 ring-4 ring-[#F3EFE6] dark:ring-[#14120F]" />
                <span className="font-serif text-xs font-medium text-[#1B1F1C] dark:text-[#EDE6D8]">
                  {step.title}
                </span>
                <span className="text-[11px] text-[#7A7566] dark:text-[#8F8778] mt-0.5">
                  {step.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
