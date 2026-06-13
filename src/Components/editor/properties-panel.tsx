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

interface PropertiesPanelProps {
  element: DesignElement | null
  onUpdate: (id: string, patch: Partial<DesignElement>) => void
  onDelete: (id: string) => void
}

// Accent Swatches aligned to your primary brand colors [1]
const SWATCHES = ["#e9204f", "#ffffff", "#1b1b1b", "#f5b700", "#1e90ff", "#2dd4bf"]

export function PropertiesPanel({ element, onUpdate, onDelete }: PropertiesPanelProps) {
  return (
    <aside className="z-20 flex w-[280px] shrink-0 flex-col border-l border-white/5 bg-[#131315]/90 backdrop-blur-md text-white select-none">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 px-4 bg-[#0e0e10]/30">
        <h2 className="text-sm font-semibold">Properties</h2>
        {element && (
          <button
            onClick={() => onDelete(element.id)}
            className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-500/10 hover:text-[#e9204f]"
            aria-label="Delete element"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      {!element ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-dashed border-white/5 text-neutral-500">
            <Maximize className="size-5" />
          </div>
          <p className="text-sm font-medium text-neutral-200">No selection</p>
          <p className="text-xs leading-relaxed text-neutral-500">
            Select an element on the canvas to edit its position, scale,
            rotation, color and more.
          </p>
        </div>
      ) : (
        <div
          key={element.id}
          className="scrollbar-thin flex flex-1 animate-in flex-col gap-5 overflow-y-auto p-4 duration-200 fade-in slide-in-from-right-2 no-scrollbar"
        >
          {/* Element Identity */}
          <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-[#e9204f]/10 text-[#e9204f]">
              <Type className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{element.name}</p>
              <p className="text-[11px] capitalize text-neutral-500 font-bold">
                {element.type} layer
              </p>
            </div>
          </div>

          {/* Position */}
          <Section title="Position">
            <div className="grid grid-cols-2 gap-2">
              <NumberField
                icon={<MoveHorizontal className="size-3.5" />}
                label="X"
                value={Math.round(element.x)}
                onChange={(v) => onUpdate(element.id, { x: v })}
              />
              <NumberField
                icon={<MoveVertical className="size-3.5" />}
                label="Y"
                value={Math.round(element.y)}
                onChange={(v) => onUpdate(element.id, { y: v })}
              />
            </div>
          </Section>

          {/* Scale */}
          <Section title="Scale">
            <SliderField
              label="Width"
              min={24}
              max={440}
              value={Math.round(element.width)}
              suffix="px"
              onChange={(v) => onUpdate(element.id, { width: v })}
            />
            <SliderField
              label="Height"
              min={24}
              max={520}
              value={Math.round(element.height)}
              suffix="px"
              onChange={(v) => onUpdate(element.id, { height: v })}
            />
          </Section>

          {/* Rotation */}
          <Section title="Rotation">
            <SliderField
              label={<RotateCw className="size-3.5" />}
              min={-180}
              max={180}
              value={Math.round(element.rotation)}
              suffix="°"
              onChange={(v) => onUpdate(element.id, { rotation: v })}
            />
          </Section>

          {/* Opacity */}
          <Section title="Opacity">
            <SliderField
              label="Alpha"
              min={0}
              max={100}
              value={Math.round(element.opacity * 100)}
              suffix="%"
              onChange={(v) => onUpdate(element.id, { opacity: v / 100 })}
            />
          </Section>

          {/* Color */}
          {element.type !== "image" && (
            <Section title="Color">
              <div className="flex items-center gap-2">
                <label className="relative size-9 cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]">
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
                  className="h-9 flex-1 rounded-lg border border-white/5 bg-white/[0.02] px-2 font-mono text-xs uppercase outline-none focus:border-[#e9204f]/40 text-white"
                  aria-label="Color hex"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdate(element.id, { color: c })}
                    className="size-6 rounded-md border border-white/5 transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                    aria-label={`Set color ${c}`}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Typography */}
          {element.type === "text" && (
            <Section title="Typography">
              <SelectField
                value={element.fontFamily ?? FONT_FAMILIES[0]}
                options={FONT_FAMILIES.map((f) => ({ label: f, value: f }))}
                onChange={(v) => onUpdate(element.id, { fontFamily: v })}
              />
              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="Size"
                  value={element.fontSize ?? 24}
                  suffix="px"
                  onChange={(v) => onUpdate(element.id, { fontSize: v })}
                />
                <SelectField
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
              <input
                value={element.text ?? ""}
                onChange={(e) => onUpdate(element.id, { text: e.target.value })}
                placeholder="Enter text…"
                className="h-9 w-full rounded-lg border border-white/5 bg-white/[0.02] px-2 text-sm outline-none focus:border-[#e9204f]/40 text-white"
                aria-label="Text content"
              />
            </Section>
          )}
        </div>
      )}
    </aside>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
        {title}
      </p>
      {children}
    </div>
  )
}

function NumberField({
  label,
  icon,
  value,
  suffix,
  onChange,
}: {
  label: string
  icon?: React.ReactNode
  value: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex h-9 items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-2 transition-colors focus-within:border-[#e9204f]/40">
      <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
        {icon}
        {label}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-transparent text-right text-xs tabular-nums outline-none text-white font-semibold"
      />
      {suffix && (
        <span className="text-[10px] text-neutral-500">{suffix}</span>
      )}
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
  label: React.ReactNode
  min: number
  max: number
  value: number
  suffix?: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 text-neutral-400 font-semibold">
          {label}
        </span>
        <span className="tabular-nums text-neutral-200 font-extrabold">
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
        className="editor-slider h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          // Set to active brand primary color track [1]
          background: `linear-gradient(to right, #e9204f ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
        }}
      />
    </div>
  )
}

function SelectField({
  value,
  options,
  onChange,
}: {
  value: string
  options: { label: string; value: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-white/5 bg-white/[0.02] px-2 pr-7 text-xs outline-none transition-colors focus:border-[#e9204f]/40 text-neutral-300"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#131315]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
    </div>
  )
}