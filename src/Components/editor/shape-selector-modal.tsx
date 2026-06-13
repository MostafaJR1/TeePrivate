"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { DesignElement } from "@/lib/editor-types"
import { useRef, useEffect } from "react"

interface ShapeSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectShape: (shape: Partial<DesignElement>) => void
}

const SHAPES = [
  { id: "rect", name: "Rectangle", type: "rect", icon: "▭" },
  { id: "circle", name: "Circle", type: "circle", icon: "●" },
  { id: "triangle", name: "Triangle", type: "triangle", icon: "△" },
  { id: "line", name: "Line", type: "line", icon: "━" },
]

export function ShapeSelectorModal({ isOpen, onClose, onSelectShape }: ShapeSelectorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Select Shape</h2>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Shape Grid */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {SHAPES.map((shape) => (
                <motion.button
                  key={shape.id}
                  onClick={() => {
                    onSelectShape({
                      type: shape.type as any,
                      name: shape.name,
                      width: 140,
                      height: 140,
                      color: "#e9204f",
                      rotation: 0,
                      opacity: 1,
                    })
                    onClose()
                  }}
                  className="group relative aspect-square rounded-lg border border-white/10 hover:border-[#e9204f] bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:shadow-[#e9204f]/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-4xl text-neutral-400 group-hover:text-[#e9204f] transition-colors">
                    {shape.icon}
                  </div>
                  <span className="text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">
                    {shape.name}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Advanced Controls */}
            <div className="border-t border-white/5 p-6 bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-white mb-4">Shape Properties</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">
                    Width
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    defaultValue="140"
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e9204f]"
                  />
                  <span className="text-xs text-neutral-500 mt-1 block">Auto</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">
                    Height
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    defaultValue="140"
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e9204f]"
                  />
                  <span className="text-xs text-neutral-500 mt-1 block">Auto</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    defaultValue="#e9204f"
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
