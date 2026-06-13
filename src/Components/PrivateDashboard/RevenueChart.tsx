"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowUpOutline } from "react-icons/io5";

interface DataPoint {
  day: string;
  revenue: number;
  label: string;
  x: number;
  y: number;
}

interface Dataset {
  label: string;
  total: string;
  trend: string;
  path: string;      // The main curved path
  areaPath: string;  // The underlying glow shadow path
  points: DataPoint[];
}

const datasets: Record<"day" | "week" | "month", Dataset> = {
  day: {
    label: "VS PREV. DAY",
    total: "1,900.00 DH",
    trend: "2.6%",
    path: "M 30,128 C 75,118 75,108 120,108 C 165,108 165,122 210,122 C 255,122 255,92 300,92 C 345,92 345,112 390,112 C 435,112 435,72 480,72 C 525,72 525,84 570,84",
    areaPath: "M 30,128 C 75,118 75,108 120,108 C 165,108 165,122 210,122 C 255,122 255,92 300,92 C 345,92 345,112 390,112 C 435,112 435,72 480,72 C 525,72 525,84 570,84 L 570,175 L 30,175 Z",
    points: [
      { day: "12 AM", revenue: 800, label: "Today, 12:00 AM", x: 30, y: 128 },
      { day: "4 AM", revenue: 1300, label: "Today, 4:00 AM", x: 120, y: 108 },
      { day: "8 AM", revenue: 950, label: "Today, 8:00 AM", x: 210, y: 122 },
      { day: "12 PM", revenue: 1700, label: "Today, 12:00 PM", x: 300, y: 92 },
      { day: "4 PM", revenue: 1200, label: "Today, 4:00 PM", x: 390, y: 112 },
      { day: "8 PM", revenue: 2200, label: "Today, 8:00 PM", x: 480, y: 72 },
      { day: "11 PM", revenue: 1900, label: "Today, 11:00 PM", x: 570, y: 84 },
    ],
  },
  week: {
    label: "VS PREV. WEEK",
    total: "4,820.00 DH",
    trend: "8.5%",
    path: "M 30,100 C 75,106 75,112 120,112 C 165,112 165,72 210,72 C 255,72 255,88 300,88 C 345,88 345,44 390,44 C 435,44 435,80 480,80 C 525,80 525,52 570,52",
    areaPath: "M 30,100 C 75,106 75,112 120,112 C 165,112 165,72 210,72 C 255,72 255,88 300,88 C 345,88 345,44 390,44 C 435,44 435,80 480,80 C 525,80 525,52 570,52 L 570,175 L 30,175 Z",
    points: [
      { day: "Mon", revenue: 1500, label: "Monday", x: 30, y: 100 },
      { day: "Tue", revenue: 1200, label: "Tuesday", x: 120, y: 112 },
      { day: "Wed", revenue: 2200, label: "Wednesday", x: 210, y: 72 },
      { day: "Thu", revenue: 1800, label: "Thursday", x: 300, y: 88 },
      { day: "Fri", revenue: 2900, label: "Friday", x: 390, y: 44 },
      { day: "Sat", revenue: 2000, label: "Saturday", x: 480, y: 80 },
      { day: "Sun", revenue: 2700, label: "Sunday", x: 570, y: 52 },
    ],
  },
  month: {
    label: "VS PREV. MONTH",
    total: "14,350.00 DH",
    trend: "12.4%",
    path: "M 30,116 C 75,102 75,88 120,88 C 165,88 165,104 210,104 C 255,104 255,56 300,56 C 345,56 345,76 390,76 C 435,76 435,36 480,36 C 525,36 525,66 570,66",
    areaPath: "M 30,116 C 75,102 75,88 120,88 C 165,88 165,104 210,104 C 255,104 255,56 300,56 C 345,56 345,76 390,76 C 435,76 435,36 480,36 C 525,36 525,66 570,66 L 570,175 L 30,175 Z",
    points: [
      { day: "Week 1", revenue: 1100, label: "Month Week 1", x: 30, y: 116 },
      { day: "Week 2", revenue: 1800, label: "Month Week 2", x: 120, y: 88 },
      { day: "Week 3", revenue: 1400, label: "Month Week 3", x: 210, y: 104 },
      { day: "Week 4", revenue: 2600, label: "Month Week 4", x: 300, y: 56 },
      { day: "Week 5", revenue: 2100, label: "Month Week 5", x: 390, y: 76 },
      { day: "Week 6", revenue: 3100, label: "Month Week 6", x: 480, y: 36 },
      { day: "Week 7", revenue: 2350, label: "Month Week 7", x: 570, y: 66 },
    ],
  },
};

type TabType = "day" | "week" | "month";

export function RevenueChart() {
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData = datasets[activeTab];
  const activeHoveredPoint = hoveredIndex !== null ? activeData.points[hoveredIndex] : null;

  return (
    <div className="bg-[#131315] border border-white/5  p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-visible select-none">
      
      {/* 1. CHART HEADER & SWITCHER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Revenue Performance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-bold text-white tracking-tight">{activeData.total}</h3>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 leading-none">
              <IoArrowUpOutline size={11} /> {activeData.trend} <span className="text-neutral-500 ml-1">{activeData.label}</span>
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Pill */}
        <div className="inline-flex rounded-full bg-white/5 p-1 border border-white/5 backdrop-blur-sm">
          {(["day", "week", "month"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-350 cursor-pointer ${
                activeTab === tab ? "text-[#131315]" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="chartActiveTabBg"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. CURVED CHART AREA (SVG WITH SMOOTH PATH TRANSITIONS) [1.1.2] */}
      <div className="w-full h-56 relative flex items-end overflow-visible">
        
        {/* Background Vertical Grid Dotted Lines */}
        <div className="absolute inset-y-0 inset-x-0 flex justify-between pointer-events-none px-4 pb-6 z-0">
          {[1, 2, 3, 4, 5, 6].map((line) => (
            <div key={line} className="h-full border-l border-white/[0.02] border-dashed" />
          ))}
        </div>

        {/* Dotted Average Baseline (AVG) */}
        <div className="absolute inset-x-0 top-[50%] h-[1px] border-t border-amber-500/10 border-dashed z-0 flex justify-end items-start pr-12">
          <span className="text-[9px] font-bold uppercase text-amber-500/30 bg-[#131315] px-1 -translate-y-[6px]">AVG</span>
        </div>

        {/* THE MAIN SVG CANVAS */}
        <svg 
          className="absolute inset-x-0 top-0 w-full h-[85%] overflow-visible" 
          fill="none" 
          viewBox="0 0 600 200" 
          preserveAspectRatio="none"
        >
          {/* Animated Curved Path (Framer motion morphs this path automatically!) [1] */}
          <motion.path 
            d={activeData.path} 
            stroke="#e9204f" 
            strokeWidth="3" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, d: activeData.path }}
            transition={{ 
              pathLength: { duration: 1.5, ease: "easeOut" },
              d: { duration: 0.5, ease: "easeInOut" } // Handles smooth morphing between datasets [1]
            }}
          />

          {/* Under-glow shaded gradient Area (Smoothly morphs in sync) [1] */}
          <motion.path 
            d={activeData.areaPath} 
            fill="url(#trendGlow)" 
            animate={{ d: activeData.areaPath }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          <defs>
            <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9204f" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#e9204f" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* DYNAMIC INTERACTION ELEMENTS (Veritcal line, glowing dot, and tooltip) [1] */}
          {activeHoveredPoint && (
            <g className="transition-all duration-150">
              {/* Vertical Guide Line */}
              <line 
                x1={activeHoveredPoint.x} 
                y1="10" 
                x2={activeHoveredPoint.x} 
                y2="175" 
                stroke="rgba(233, 32, 79, 0.2)" 
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Outer Pulsating Ring */}
              <circle 
                cx={activeHoveredPoint.x} 
                cy={activeHoveredPoint.y} 
                r="8" 
                fill="rgba(233, 32, 79, 0.25)" 
                className="animate-ping"
              />
              {/* Inner Solid White Dot */}
              <circle 
                cx={activeHoveredPoint.x} 
                cy={activeHoveredPoint.y} 
                r="4.5" 
                fill="#ffffff" 
                stroke="#e9204f"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* TRANSPARENT COLLISION INTERACTIVE HITBOXES (Trigger on hover) [1] */}
        <div className="absolute inset-x-0 top-0 h-[85%] flex z-30 overflow-visible">
          {activeData.points.map((pt, idx) => (
            <div
              key={idx}
              className="flex-1 h-full cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        {/* FLOATING GLASSMORPHIC TOOLTIP [1] */}
        <AnimatePresence>
          {activeHoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute bg-[#1c1c1e]/90 backdrop-blur-md border border-white/5 rounded p-3 shadow-2xl z-40 pointer-events-none flex flex-col leading-none"
              style={{ 
                left: `${(activeHoveredPoint.x / 600) * 100}%`,
                top: `${(activeHoveredPoint.y / 200) * 100 - 30}%`,
                transform: "translate(-50%, -100%)"
              }}
            >
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                {activeHoveredPoint.label}
              </span>
              <span className="text-sm font-bold text-white">
                {activeHoveredPoint.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} DH
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Y-Axis references */}
        <div className="absolute right-0 inset-y-0 flex flex-col justify-between text-[9px] font-bold text-neutral-500 text-right pr-1 pb-6 h-[85%] pointer-events-none z-10">
          <span>3.5K</span>
          <span>1.5K</span>
          <span>0</span>
        </div>
        
        {/* Bottom X-Axis labels (Fade based on active tab) */}
        <div className="w-full border-t border-white/5 pt-3 flex justify-between text-[10px] font-bold text-neutral-500 uppercase px-1 z-10">
          {activeData.points.map((pt, idx) => (
            <span key={idx} className="w-12 text-center">{pt.day}</span>
          ))}
        </div>
      </div>

    </div>
  );
}