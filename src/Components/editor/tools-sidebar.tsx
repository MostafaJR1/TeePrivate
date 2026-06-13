"use client"

import {
  ImageIcon,
  MousePointer2,
  Move,
  Shapes,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ToolId } from "@/lib/editor-types"

interface Tool {
  id: ToolId
  label: string
  icon: LucideIcon
  shortcut: string
}

const TOOLS: Tool[] = [
  { id: "select", label: "Select", icon: MousePointer2, shortcut: "V" },
  { id: "move", label: "Move", icon: Move, shortcut: "M" },
  { id: "text", label: "Text", icon: Type, shortcut: "T" },
  { id: "shapes", label: "Shapes", icon: Shapes, shortcut: "S" },
  { id: "image", label: "Image", icon: ImageIcon, shortcut: "I" },
  { id: "ai", label: "AI Generate", icon: Sparkles, shortcut: "A" },
]

interface ToolsSidebarProps {
  activeTool: ToolId
  onToolChange: (tool: ToolId) => void
}

export function ToolsSidebar({ activeTool, onToolChange }: ToolsSidebarProps) {
  return (
    <aside className="z-20 flex w-[76px] shrink-0 flex-col items-center gap-1 border-r border-white/5 bg-[#131315]/90 py-3 backdrop-blur-xl select-none">
      {TOOLS.map((tool) => {
        const Icon = tool.icon
        const active = activeTool === tool.id
        return (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            aria-pressed={active}
            aria-label={tool.label}
            className={cn(
              "group relative flex w-[60px] flex-col items-center gap-1 rounded-xl py-2.5 transition-all duration-200",
              active
                ? "bg-[#e9204f]/10 text-[#e9204f]" // Active brand color highlight [1]
                : "text-neutral-500 hover:bg-white/5 hover:text-white",
            )}
          >
            {active && (
              // Left-side active selection bar in pink [1]
              <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#e9204f]" />
            )}
            <Icon
              className={cn(
                "size-5 transition-transform duration-200 group-hover:scale-110",
                active && "drop-shadow-[0_0_6px_rgba(233,32,79,0.35)]",
              )}
            />
            <span className="text-[10px] font-medium leading-none">
              {tool.label}
            </span>
            {/* Shortcut Tooltip */}
            <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md border border-white/5 bg-[#1c1c1e] px-2.5 py-1 text-[11px] text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 md:block z-50">
              {tool.label}
              <kbd className="ml-1.5 rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-neutral-500 font-bold uppercase">
                {tool.shortcut}
              </kbd>
            </span>
          </button>
        )
      })}
    </aside>
  )
}