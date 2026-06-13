"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface ToolSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
}

export function ToolSection({
  title,
  children,
  defaultOpen = true,
  icon,
}: ToolSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-white transition-colors duration-150 uppercase tracking-wider"
      >
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-0" : "-rotate-90"
          }`}
        />
        {icon && <span className="text-neutral-500">{icon}</span>}
        <span className="flex-1 text-left">{title}</span>
      </button>

      {isOpen && (
        <div className="editor-expand overflow-hidden bg-white/[0.02]">
          <div className="flex flex-col gap-2 px-3 py-2">{children}</div>
        </div>
      )}
    </div>
  )
}
