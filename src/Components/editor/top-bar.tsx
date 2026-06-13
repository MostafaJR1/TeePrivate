"use client"

import { useState } from "react"
import { Check, Cloud, Download, Loader2, Pencil, Share2, Sparkles } from "lucide-react"

interface TopBarProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  onExport: () => void
  exporting: boolean
}

export function TopBar({
  projectName,
  onProjectNameChange,
  onExport,
  exporting,
}: TopBarProps) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(true)

  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/50 px-6 backdrop-blur-xl text-white select-none">
      {/* Brand + project name */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e9204f] to-pink-600 shadow-lg shadow-[#e9204f]/20">
            <Sparkles className="size-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            TeePrivate
          </span>
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="group flex items-center gap-1.5">
          {editing ? (
            <input
              autoFocus
              value={projectName}
              onChange={(e) => {
                onProjectNameChange(e.target.value)
                setSaved(false)
              }}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
              className="editor-input w-56 bg-white/[0.03] border-white/10 focus:border-[#e9204f] focus:bg-white/[0.05] text-sm font-medium"
              aria-label="Project name"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-200 transition-all hover:bg-white/5 hover:text-white"
            >
              <span className="max-w-xs truncate">{projectName}</span>
              <Pencil className="size-3.5 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-neutral-400">
          {saved ? (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5">
                <Check className="size-3.5 text-[#e9204f]" />
                <span>Saved</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/[0.05] border border-yellow-500/20">
                <Cloud className="size-3.5 text-yellow-500" />
                <span>Unsaved</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-neutral-300 transition-all hover:bg-white/5 hover:text-white active:scale-95 md:inline-flex"
        >
          <Share2 className="size-4" />
          Share
        </button>
        <div className="h-6 w-px bg-white/5 hidden md:block" />
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-neutral-200 transition-all hover:bg-white/10 hover:border-white/15 active:scale-95"
        >
          <Cloud className="size-4 text-neutral-400" />
          <span className="hidden sm:inline">Save</span>
        </button>
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#e9204f] px-5 text-sm font-semibold text-white transition-all hover:bg-[#ee2755] hover:shadow-lg hover:shadow-[#e9204f]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#e9204f]"
        >
          {exporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          <span>{exporting ? "Exporting…" : "Export"}</span>
        </button>
      </div>
    </header>
  )
}
