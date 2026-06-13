"use client"

import type React from "react"
import {
  ChevronDown,
  Maximize,
  MoveHorizontal,
  MoveVertical,
  RotateCw,
  Trash2,
  Type,
} from "lucide-react"
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  type DesignElement,
} from "@/lib/editor-types"
import { PropertySection } from "./property-section"

interface PropertiesPanelProps {
  element: DesignElement | null
  onUpdate: (id: string, patch: Partial<DesignElement>) => void
  onDelete: (id: string) => void
  mockupOpacity?: number
  onMockupOpacityChange?: (opacity: number) => void
}

// Accent Swatches aligned to your primary brand colors
const SWATCHES = ["#e9204f", "#ffffff", "#1b1b1b", "#f5b700", "#1e90ff", "#2dd4bf"]

export function PropertiesPanel({ element, onUpdate, onDelete, mockupOpacity = 1, onMockupOpacityChange }: PropertiesPanelProps) {
  return (
    <aside className="z-20 flex w-80 shrink-0 flex-col border-l border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl text-white select-none">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-6 bg-[#131315]/30">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-white">Design</h2>
          <p className="text-xs text-neutral-500 font-medium">Element properties</p>
        </div>
        {element && (
          <button
            onClick={() => onDelete(element.id)}
            className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-red-500/10 hover:text-[#e9204f] active:scale-95"
            aria-label="Delete element"
            title="Delete element"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      {!element ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl border-2 border-dashed border-white/10 text-neutral-500">
            <Maximize className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-200">No Selection</p>
            <p className="text-xs leading-relaxed text-neutral-500 mt-1">
              Select an element on the canvas to view and edit its properties
            </p>
          </div>
        </div>
      ) : (
        <div
          key={element.id}
          className="flex flex-1 flex-col overflow-y-auto editor-scrollbar"
        >
          {/* Element Identity Card */}
          <div className="px-4 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/5 px-3 py-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-[#e9204f]/15 text-[#e9204f]">
                <Type className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{element.name}</p>
                <p className="text-[11px] capitalize text-neutral-500 font-medium mt-0.5">
                  {element.type} layer
                </p>
              </div>
            </div>
          </div>

          {/* Properties Sections */}
          <div className="flex-1">
            {/* Position & Size */}
            <PropertySection title="Position & Size" icon={<MoveHorizontal className="size-3.5" />}>
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="X"
                  value={Math.round(element.x)}
                  onChange={(v) => onUpdate(element.id, { x: v })}
                />
                <NumberField
                  label="Y"
                  value={Math.round(element.y)}
                  onChange={(v) => onUpdate(element.id, { y: v })}
                />
                <NumberField
                  label="Width"
                  value={Math.round(element.width)}
                  onChange={(v) => onUpdate(element.id, { width: v })}
                  suffix="px"
                />
                <NumberField
                  label="Height"
                  value={Math.round(element.height)}
                  onChange={(v) => onUpdate(element.id, { height: v })}
                  suffix="px"
                />
              </div>
            </PropertySection>

            {/* Appearance */}
            <PropertySection title="Appearance">
              <SliderField
                label="Rotation"
                min={-180}
                max={180}
                value={Math.round(element.rotation)}
                suffix="°"
                onChange={(v) => onUpdate(element.id, { rotation: v })}
              />
              <SliderField
                label="Opacity"
                min={0}
                max={100}
                value={Math.round(element.opacity * 100)}
                suffix="%"
                onChange={(v) => onUpdate(element.id, { opacity: v / 100 })}
              />
            </PropertySection>

            {/* Color */}
            {element.type !== "image" && (
              <PropertySection title="Color">
                <div className="flex items-center gap-2 mb-3">
                  <label className="relative size-10 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] shadow-sm hover:border-white/20 transition-colors">
                    <span
                      className="block h-full w-full"
                      style={{ backgroundColor: element.color }}
                    />
                    <input
                      type="color"
                      value={element.color}
                      onChange={(e) =>
                        onUpdate(element.id, { color: e.target.value })
                      }
                      className="absolute inset-0 cursor-pointer opacity-0"
                      aria-label="Pick color"
                    />
                  </label>
                  <input
                    value={element.color.toUpperCase()}
                    onChange={(e) => onUpdate(element.id, { color: e.target.value })}
                    className="editor-input flex-1 text-xs font-mono"
                    aria-label="Color hex"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {SWATCHES.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdate(element.id, { color: c })}
                      className="size-7 rounded-lg border border-white/10 transition-all hover:scale-110 hover:border-white/20 shadow-sm"
                      style={{ backgroundColor: c }}
                      aria-label={`Set color ${c}`}
                    />
                  ))}
                </div>
              </PropertySection>
            )}

            {/* Typography */}
            {element.type === "text" && (
              <PropertySection title="Typography">
                <SelectField
                  label="Font"
                  value={element.fontFamily ?? FONT_FAMILIES[0]}
                  options={FONT_FAMILIES.map((f) => ({ label: f, value: f }))}
                  onChange={(v) => onUpdate(element.id, { fontFamily: v })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Size"
                    value={element.fontSize ?? 24}
                    suffix="px"
                    onChange={(v) => onUpdate(element.id, { fontSize: v })}
                  />
                  <SelectField
                    label="Weight"
                    value={String(element.fontWeight ?? 600)}
                    options={FONT_WEIGHTS.map((w) => ({
                      label: w.label,
                      value: String(w.value),
                    }))}
                    onChange={(v) =>
                      onUpdate(element.id, { fontWeight: Number(v) })
                    }
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Text
                  </label>
                  <textarea
                    value={element.text ?? ""}
                    onChange={(e) => onUpdate(element.id, { text: e.target.value })}
                    placeholder="Enter your text here…"
                    className="editor-input w-full text-sm resize-none h-20"
                    aria-label="Text content"
                  />
                </div>
              </PropertySection>
            )}
          </div>
        </div>
      )}

      {/* Mockup Blend Settings - Always visible */}
      <div className="border-t border-white/5 bg-white/[0.02] p-4 mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex-1">
            Mockup Blend
          </span>
        </div>
        <SliderField
          label="Mockup Opacity"
          min={0}
          max={100}
          value={Math.round(mockupOpacity * 100)}
          suffix="%"
          onChange={(v) => onMockupOpacityChange?.(v / 100)}
        />
        <p className="text-[11px] text-neutral-500 mt-2">
          Adjust mockup visibility to blend with your design
        </p>
      </div>
    </aside>
  )
}

function NumberField({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string
  value: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 transition-colors hover:border-white/15 focus-within:border-[#e9204f]/40 focus-within:bg-white/[0.05]">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-sm outline-none text-white font-semibold"
        />
        {suffix && (
          <span className="text-xs text-neutral-500 font-medium">{suffix}</span>
        )}
      </div>
    </div>
  )
}

function SliderField({
  label,
  min,
  max,
  value,
  suffix,
  onChange,
}: {
  label: string
  min: number
  max: number
  value: number
  suffix?: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs font-bold text-neutral-200 tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="editor-slider h-2 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, #e9204f ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
        }}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="editor-input appearance-none pr-8 w-full"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#131315]">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  )
}
