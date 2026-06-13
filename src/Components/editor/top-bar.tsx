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
    <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e10]/85 px-4 backdrop-blur-md text-white select-none">
      {/* Brand + project name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#e9204f] to-pink-600 shadow-md shadow-[#e9204f]/15">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            Mockly
          </span>
        </div>

        <div className="mx-1 h-5 w-px bg-white/5" />

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
              className="w-48 rounded-md border border-[#e9204f]/40 bg-white/[0.02] px-2 py-1 text-sm font-medium outline-none text-white"
              aria-label="Project name"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {projectName}
              <Pencil className="size-3 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}
        </div>

        <span className="flex items-center gap-1 text-xs text-neutral-500 font-semibold">
          {saved ? (
            <>
              <Check className="size-3 text-[#e9204f]" /> Saved
            </>
          ) : (
            <>
              <Cloud className="size-3" /> Unsaved
            </>
          )}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hidden h-8 items-center gap-1.5 rounded-md px-3 text-sm font-bold text-neutral-400 transition-colors hover:bg-white/5 hover:text-white active:scale-95 sm:inline-flex"
        >
          <Share2 className="size-4" />
          Share
        </button>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-bold text-neutral-200 transition-all hover:bg-white/10 active:scale-95"
        >
          <Cloud className="size-4 text-neutral-400" />
          Save
        </button>
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#e9204f] px-3 text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {exporting ? (
            <Loader2 className="size-4 animate-spin text-white" />
          ) : (
            <Download className="size-4 text-white" />
          )}
          {exporting ? "Exporting…" : "Export"}
        </button>
      </div>
    </header>
  )
}