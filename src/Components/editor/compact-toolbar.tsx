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

interface CompactToolbarProps {
  activeTool: ToolId
  onToolChange: (tool: ToolId) => void
}

export function CompactToolbar({ activeTool, onToolChange }: CompactToolbarProps) {
  return (
    <div className="absolute left-6 bottom-6 z-30 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a]/60 p-2 backdrop-blur-xl">
      {TOOLS.map((tool) => {
        const Icon = tool.icon
        const isActive = activeTool === tool.id
        
        return (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
            className={cn(
              "group relative p-2 rounded-lg transition-all duration-200",
              isActive
                ? "bg-[#e9204f] text-white shadow-lg shadow-[#e9204f]/50"
                : "text-neutral-400 hover:text-white hover:bg-white/10",
            )}
          >
            <Icon className={cn(
              "size-5",
              isActive && "drop-shadow-[0_0_8px_rgba(233,32,79,0.4)]"
            )} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1c1c1e] px-2 py-1 text-xs font-medium text-white opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">
              {tool.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
