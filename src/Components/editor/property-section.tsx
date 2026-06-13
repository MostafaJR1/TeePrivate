"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface PropertySectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
}

export function PropertySection({
  title,
  children,
  defaultOpen = true,
  icon,
}: PropertySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors duration-150"
      >
        <ChevronDown
          className={`size-4 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-0" : "-rotate-90"
          }`}
        />
        {icon && <span className="text-neutral-400">{icon}</span>}
        <span className="flex-1 text-left">{title}</span>
      </button>

      {isOpen && (
        <div className="editor-expand overflow-hidden">
          <div className="px-4 py-3 space-y-3 bg-white/[0.01]">{children}</div>
        </div>
      )}
    </div>
  )
}
