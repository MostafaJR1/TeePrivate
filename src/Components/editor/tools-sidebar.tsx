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
import { ToolSection } from "./tool-section"

interface Tool {
  id: ToolId
  label: string
  icon: LucideIcon
  shortcut: string
}

const SELECTION_TOOLS: Tool[] = [
  { id: "select", label: "Select", icon: MousePointer2, shortcut: "V" },
  { id: "move", label: "Move", icon: Move, shortcut: "M" },
]

const CREATION_TOOLS: Tool[] = [
  { id: "text", label: "Text", icon: Type, shortcut: "T" },
  { id: "shapes", label: "Shapes", icon: Shapes, shortcut: "S" },
  { id: "image", label: "Image", icon: ImageIcon, shortcut: "I" },
  { id: "ai", label: "AI Generate", icon: Sparkles, shortcut: "A" },
]

interface ToolsSidebarProps {
  activeTool: ToolId
  onToolChange: (tool: ToolId) => void
}

function ToolButton({
  tool,
  isActive,
  onClick,
}: {
  tool: Tool
  isActive: boolean
  onClick: () => void
}) {
  const Icon = tool.icon
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={tool.label}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-[#e9204f]/15 text-[#e9204f] border border-[#e9204f]/30"
          : "text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent",
      )}
    >
      {isActive && (
        <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#e9204f]" />
      )}
      <Icon className={cn("size-5 flex-shrink-0", isActive && "drop-shadow-[0_0_8px_rgba(233,32,79,0.4)]")} />
      <span className="flex-1 text-left truncate">{tool.label}</span>
      <kbd
        className={cn(
          "hidden text-[10px] font-bold uppercase px-1.5 py-1 rounded bg-white/5 text-neutral-500 whitespace-nowrap lg:inline",
          isActive && "bg-[#e9204f]/20 text-[#e9204f]",
        )}
      >
        {tool.shortcut}
      </kbd>
    </button>
  )
}

export function ToolsSidebar({ activeTool, onToolChange }: ToolsSidebarProps) {
  return (
    <aside className="z-20 flex w-56 shrink-0 flex-col border-r border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl text-white select-none overflow-y-auto editor-scrollbar">
      <div className="flex-1 space-y-1 p-4">
        <ToolSection title="Selection & Navigation" defaultOpen={true}>
          <div className="space-y-2">
            {SELECTION_TOOLS.map((tool) => (
              <ToolButton
                key={tool.id}
                tool={tool}
                isActive={activeTool === tool.id}
                onClick={() => onToolChange(tool.id)}
              />
            ))}
          </div>
        </ToolSection>

        <ToolSection title="Content Creation" defaultOpen={true}>
          <div className="space-y-2">
            {CREATION_TOOLS.map((tool) => (
              <ToolButton
                key={tool.id}
                tool={tool}
                isActive={activeTool === tool.id}
                onClick={() => onToolChange(tool.id)}
              />
            ))}
          </div>
        </ToolSection>

        <ToolSection title="Quick Tips" defaultOpen={false}>
          <div className="space-y-2 text-xs text-neutral-400">
            <div className="flex gap-2 items-start">
              <span className="text-[#e9204f] font-bold">•</span>
              <span>Drag elements on canvas to move them</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[#e9204f] font-bold">•</span>
              <span>Use Properties panel to fine-tune</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[#e9204f] font-bold">•</span>
              <span>Export your design when ready</span>
            </div>
          </div>
        </ToolSection>
      </div>
    </aside>
  )
}
