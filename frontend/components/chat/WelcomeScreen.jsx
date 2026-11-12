"use client";

import React from "react";
import {
  Search,
  Globe,
  PenTool,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Bot,
} from "lucide-react";

const SUGGESTIONS = [
  {
    title: "AI in Education",
    query: "The future of artificial intelligence in education",
    icon: "🎓",
  },
  {
    title: "Brain-Computer Interfaces",
    query: "Recent developments in brain-computer interfaces",
    icon: "🧠",
  },
  {
    title: "Healthcare ML",
    query: "Applications of machine learning in healthcare",
    icon: "⚕️",
  },
  {
    title: "Generative AI in Coding",
    query: "The impact of generative AI on software engineering",
    icon: "💻",
  },
];

const AGENTS = [
  {
    name: "Search Agent",
    tool: "Tavily Search",
    desc: "Scours the live web for recent, authoritative sources",
    icon: Search,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    name: "Reader Agent",
    tool: "BeautifulSoup",
    desc: "Extracts in-depth content from the most relevant pages",
    icon: Globe,
    color: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    name: "Writer Chain",
    tool: "Groq LLM",
    desc: "Synthesizes data into structured research reports",
    icon: PenTool,
    color: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    name: "Critic Chain",
    tool: "AI Reviewer",
    desc: "Evaluates quality with 10-point scoring and verdicts",
    icon: ShieldCheck,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

export default function WelcomeScreen({ onSelectTopic }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-14 flex flex-col items-center text-center">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono mb-6">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span>AUTONOMOUS MULTI-AGENT PIPELINE</span>
      </div>

      {/* Main Welcoming Heading */}
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
        Where should we start your research?
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-[#9A9CA5] max-w-xl mx-auto mb-10 leading-relaxed">
        Explore complex topics, uncover reliable sources, and generate detailed research reports with coordinated AI agents.
      </p>

      {/* Suggested Topics Grid */}
      <div className="w-full mb-12">
        <div className="text-xs uppercase tracking-wider text-[#646775] font-semibold mb-3 text-left">
          Suggested Topics
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectTopic(item.query)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#111318] hover:bg-[#171922] border border-[rgba(255,255,255,0.07)] hover:border-violet-500/30 text-left transition-all duration-200 group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs sm:text-sm text-[#D1D5DB] group-hover:text-white font-medium">
                  {item.query}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#646775] group-hover:text-violet-400 transform group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Agent Workflow Preview */}
      <div className="w-full text-left pt-6 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-4 h-4 text-violet-400" />
          <h2 className="text-xs uppercase tracking-wider text-[#646775] font-semibold font-mono">
            How the Agents Work
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl bg-[#0F1117] border ${agent.border} relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg bg-white/5 ${agent.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#646775]">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-white mb-0.5">
                  {agent.name}
                </h3>
                <div className="text-[10px] text-violet-300 font-mono mb-1.5">
                  {agent.tool}
                </div>
                <p className="text-[11px] text-[#8E909B] leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

