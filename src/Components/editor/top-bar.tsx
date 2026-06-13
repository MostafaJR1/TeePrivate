"use client"

import { useState } from "react"
import { Download, Loader2, Pencil, RotateCcw, RotateCw } from "lucide-react"

interface TopBarProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  onExport: () => void
  exporting: boolean
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export function TopBar({
  projectName,
  onProjectNameChange,
  onExport,
  exporting,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: TopBarProps) {
  const [editing, setEditing] = useState(false)

  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/50 px-6 backdrop-blur-xl text-white select-none">
      {/* Project name - minimal */}
      <div className="flex items-center gap-4 flex-1">
        <div className="group flex items-center gap-1.5">
          {editing ? (
            <input
              autoFocus
              value={projectName}
              onChange={(e) => {
                onProjectNameChange(e.target.value)
              }}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
              className="editor-input w-64 bg-white/[0.03] border-white/10 focus:border-[#e9204f] focus:bg-white/[0.05] text-sm font-medium"
              aria-label="Project name"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-white/5"
            >
              <span className="max-w-xs truncate">{projectName}</span>
              <Pencil className="size-3 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}
        </div>
      </div>

      {/* Actions - undo/redo and export */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="inline-flex h-9 items-center justify-center rounded-lg px-2 text-neutral-300 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="inline-flex h-9 items-center justify-center rounded-lg px-2 text-neutral-300 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <RotateCw className="size-4" />
        </button>
        <div className="w-px h-6 bg-white/10" />
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#e9204f] px-4 text-sm font-semibold text-white transition-all hover:bg-[#ee2755] hover:shadow-lg hover:shadow-[#e9204f]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#e9204f]"
        >
          {exporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  )
}
