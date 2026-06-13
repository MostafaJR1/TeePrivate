"use client"

import type React from "react"
import { useCallback, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { DesignElement } from "@/lib/editor-types"
import { createClient } from "@/utils/supabase/client"
import { 
  IoSwapHorizontalOutline, 
  IoTrashOutline, 
  IoCopyOutline, 
  IoRefreshOutline,
} from "react-icons/io5"
import { ImageSelectorModal } from "./image-selector-modal"
import { ShapeSelectorModal } from "./shape-selector-modal"

const supabase = createClient()

// Print area boundaries (based on visual guide in canvas)
const PRINT_AREA = {
  x: 120,      // left edge of print area
  y: 155,      // top edge adjusted for accurate positioning
  width: 200,
  height: 210,
}

interface CanvasProps {
  elements: DesignElement[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<DesignElement>) => void
  onDelete: (id: string) => void
  activeTool?: string
  onAddElement?: (el: DesignElement) => void
}

type DragState =
  | { mode: "move"; id: string; startX: number; startY: number; origX: number; origY: number }
  | {
      mode: "resize"
      id: string
      handle: string
      startX: number
      startY: number
      origX: number
      origY: number
      origW: number
      origH: number
    }
  | null

const HANDLES = ["nw", "ne", "sw", "se"] as const

export function Canvas({ elements, selectedId, onSelect, onUpdate, onDelete, activeTool, onAddElement }: CanvasProps) {
  const [zoom, setZoom] = useState(1)
  const dragRef = useRef<DragState>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const lastDistanceRef = useRef<number>(0)

  const [showImageSelector, setShowImageSelector] = useState(false)
  const [showShapeSelector, setShowShapeSelector] = useState(false)
  const [imageReplaceTargetId, setImageReplaceTargetId] = useState<string | null>(null)

  // Check if an element is out of bounds
  const isOutOfBounds = (el: DesignElement): boolean => {
    return (
      el.x < PRINT_AREA.x ||
      el.y < PRINT_AREA.y ||
      el.x + el.width > PRINT_AREA.x + PRINT_AREA.width ||
      el.y + el.height > PRINT_AREA.y + PRINT_AREA.height
    )
  }

  const elementsOutOfBounds = elements.filter(isOutOfBounds)

  useEffect(() => {
    if (activeTool === "image") setShowImageSelector(true)
    else if (activeTool === "shapes") setShowShapeSelector(true)
  }, [activeTool])

  // Pinch zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.05 : 0.05
        setZoom((z) => Math.max(0.25, Math.min(2.5, +(z + delta).toFixed(2))))
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const dx = (e.clientX - drag.startX) / zoom
      const dy = (e.clientY - drag.startY) / zoom

      if (drag.mode === "move") {
        onUpdate(drag.id, { x: drag.origX + dx, y: drag.origY + dy })
      } else {
        let { origX: x, origY: y, origW: w, origH: h } = drag
        if (drag.handle.includes("e")) w = Math.max(24, drag.origW + dx)
        if (drag.handle.includes("s")) h = Math.max(24, drag.origH + dy)
        if (drag.handle.includes("w")) {
          w = Math.max(24, drag.origW - dx)
          x = drag.origX + dx
        }
        if (drag.handle.includes("n")) {
          h = Math.max(24, drag.origH - dy)
          y = drag.origY + dy
        }
        onUpdate(drag.id, { x, y, width: w, height: h })
      }
    },
    [zoom, onUpdate],
  )

  const endDrag = useCallback(() => {
    dragRef.current = null
  }, [])

  const startMove = (e: React.PointerEvent, el: DesignElement) => {
    e.stopPropagation()
    onSelect(el.id)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    dragRef.current = {
      mode: "move",
      id: el.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
    }
  }

  const startResize = (e: React.PointerEvent, el: DesignElement, handle: string) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    dragRef.current = {
      mode: "resize",
      id: el.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
    }
  }

  const startRotate = (e: React.PointerEvent, el: DesignElement) => {
    e.stopPropagation()
    const handle = e.currentTarget as HTMLElement
    handle.setPointerCapture(e.pointerId)

    const rect = handle.parentElement?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - centerX
      const dy = moveEvent.clientY - centerY
      const angleRad = Math.atan2(dy, dx)
      const angleDeg = (angleRad * 180) / Math.PI + 90
      onUpdate(el.id, { rotation: angleDeg })
    }

    const handlePointerUp = (upEvent: PointerEvent) => {
      try {
        handle.releasePointerCapture(upEvent.pointerId)
      } catch {
        //
      }
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }

  const handleDuplicate = (e: React.MouseEvent, el: DesignElement) => {
    e.stopPropagation()
    const duplicateId = `el-${Date.now()}`
    const duplicate: DesignElement = {
      ...el,
      id: duplicateId,
      x: el.x + 20,
      y: el.y + 20,
      name: `${el.name} (Copy)`,
    }
    onAddElement?.(duplicate)
    onSelect(duplicateId)
  }

  const handleImageSelect = (imageUrl: string) => {
    if (imageReplaceTargetId) {
      onUpdate(imageReplaceTargetId, { src: imageUrl })
      setImageReplaceTargetId(null)
    } else {
      const el: DesignElement = {
        id: `el-${Date.now()}`,
        type: "image",
        name: "Image",
        x: 130,
        y: 200,
        width: 180,
        height: 150,
        rotation: 0,
        opacity: 1,
        color: "#e9204f",
        src: imageUrl,
      }
      onAddElement?.(el)
    }
    setShowImageSelector(false)
  }

  const handleShapeSelect = (shape: Partial<DesignElement>) => {
    const el: DesignElement = {
      id: `el-${Date.now()}`,
      type: shape.type as any,
      name: shape.name || "Shape",
      x: 150,
      y: 230,
      rotation: 0,
      opacity: 1,
      ...shape,
    } as DesignElement
    onAddElement?.(el)
    setShowShapeSelector(false)
  }

  return (
    <>
      <div
        ref={canvasRef}
        className="canvas-grid canvas-noise relative flex flex-1 items-center justify-center overflow-hidden editor-canvas-bg"
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerDown={() => onSelect(null)}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7))]" />

        <div
          className="relative transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            ref={frameRef}
            className="relative h-[520px] w-[440px] select-none rounded-3xl border border-white/8 bg-[#1b1b1b] shadow-[0_40px_100px_-20px_rgba(233,32,79,0.15),0_20px_60px_-30px_rgba(0,0,0,0.9)]"
          >
            <div className="absolute -top-7 left-0 flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-300">T-Shirt Mockup</span>
              <span className="font-medium">440 × 520</span>
            </div>

            <img
              src="/tshirt-mockup.png"
              alt="Blank t-shirt product mockup base"
              className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover opacity-95"
              crossOrigin="anonymous"
            />

            {/* Print Area Guide */}
            <div className={cn(
              "pointer-events-none absolute left-1/2 top-[30%] h-[210px] w-[200px] -translate-x-1/2 rounded-md transition-colors",
              elementsOutOfBounds.length > 0 
                ? "border-2 border-red-500 shadow-lg shadow-red-500/30 bg-red-500/5" 
                : "border border-dashed border-[#e9204f]/35"
            )} />

            {/* Error Message */}
            {elementsOutOfBounds.length > 0 && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50">
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-red-300">
                    {elementsOutOfBounds.length} element{elementsOutOfBounds.length !== 1 ? 's' : ''} outside print area
                  </p>
                  <p className="text-xs text-red-200/70 mt-1">
                    Move all designs inside the red border
                  </p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {elements.map((el) => (
                <ElementView
                  key={el.id}
                  el={el}
                  selected={el.id === selectedId}
                  outOfBounds={isOutOfBounds(el)}
                  onPointerDown={(e) => startMove(e, el)}
                />
              ))}
            </div>

            {elements.map((el) =>
              el.id === selectedId ? (
                <div
                  key={`sel-${el.id}`}
                  className="pointer-events-none absolute z-20"
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    transform: `rotate(${el.rotation}deg)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-[2px] outline outline-2 outline-[#e9204f] shadow-[0_0_0_3px_rgba(233,32,79,0.1),0_0_20px_rgba(233,32,79,0.25)]" />
                  
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-lg bg-[#e9204f] px-2.5 py-1 text-[10px] font-bold text-white shadow-lg shadow-[#e9204f]/30">
                    {Math.round(el.width)} × {Math.round(el.height)}
                  </span>

                  <div 
                    style={{ transform: `rotate(${-el.rotation}deg)` }}
                    className="absolute left-1/2 -top-14 -translate-x-1/2 z-50 bg-[#0a0a0a]/60 border border-white/10 backdrop-blur-xl rounded-2xl px-2 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto select-none"
                  >
                    {el.type === "image" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setImageReplaceTargetId(el.id)
                            setShowImageSelector(true)
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-[#e9204f] transition duration-150 cursor-pointer active:scale-95"
                          title="Replace Image"
                        >
                          <IoSwapHorizontalOutline size={15} />
                        </button>
                        <div className="h-5 w-px bg-white/5 mx-0.5" />
                      </>
                    )}

                    <button
                      onClick={(e) => handleDuplicate(e, el)}
                      className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition duration-150 cursor-pointer active:scale-95"
                      title="Duplicate Layer"
                    >
                      <IoCopyOutline size={15} />
                    </button>

                    <div className="h-5 w-px bg-white/5 mx-0.5" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(el.id)
                      }}
                      className="p-2 hover:bg-red-500/10 text-neutral-400 hover:text-[#e9204f] rounded-lg transition duration-150 cursor-pointer active:scale-95"
                      title="Delete Element"
                    >
                      <IoTrashOutline size={15} />
                    </button>
                  </div>

                  {HANDLES.map((h) => (
                    <span
                      key={h}
                      onPointerDown={(e) => startResize(e, el, h)}
                      className={cn(
                        "pointer-events-auto absolute size-3 rounded-full border-2 border-[#e9204f] bg-white shadow-lg shadow-[#e9204f]/40 hover:scale-125 transition-transform",
                        h === "nw" && "-left-1.5 -top-1.5 cursor-nwse-resize",
                        h === "ne" && "-right-1.5 -top-1.5 cursor-nesw-resize",
                        h === "sw" && "-bottom-1.5 -left-1.5 cursor-nesw-resize",
                        h === "se" && "-bottom-1.5 -right-1.5 cursor-nwse-resize",
                      )}
                    />
                  ))}

                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
                    <div className="h-7 w-px border-l border-dashed border-[#e9204f]/40" />
                    
                    <div 
                      onPointerDown={(e) => startRotate(e, el)}
                      className="w-6 h-6 rounded-full bg-[#e9204f] border-2 border-white flex items-center justify-center cursor-alias shadow-lg shadow-[#e9204f]/40 hover:scale-110 transition-transform duration-100 pointer-events-auto"
                      title="Rotate"
                    >
                      <IoRefreshOutline size={13} className="text-white" />
                    </div>
                  </div>

                </div>
              ) : null,
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-white/5 bg-[#0a0a0a]/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 backdrop-blur-xl">
          Drag to move · Handles to resize · Rotation handle above
        </div>
      </div>

      <ImageSelectorModal
        isOpen={showImageSelector}
        onClose={() => {
          setShowImageSelector(false)
          setImageReplaceTargetId(null)
        }}
        onSelect={handleImageSelect}
      />

      <ShapeSelectorModal
        isOpen={showShapeSelector}
        onClose={() => setShowShapeSelector(false)}
        onSelectShape={handleShapeSelect}
      />
    </>
  )
}


function ElementView({
  el,
  selected,
  outOfBounds = false,
  onPointerDown,
}: {
  el: DesignElement
  selected: boolean
  outOfBounds?: boolean
  onPointerDown: (e: React.PointerEvent) => void
}) {
  const baseStyle: React.CSSProperties = {
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    opacity: el.opacity,
    transform: `rotate(${el.rotation}deg)`,
  }

  return (
    <div
      onPointerDown={onPointerDown}
      className={cn(
        "absolute cursor-move",
        outOfBounds && "ring-2 ring-red-500 ring-opacity-60",
        selected ? "z-10" : "transition-shadow hover:outline hover:outline-1 hover:outline-[#e9204f]/40",
      )}
      style={baseStyle}
    >
      {el.type === "text" && (
        <span
          className="flex h-full w-full items-center justify-center text-center leading-tight"
          style={{
            color: el.color,
            fontFamily: el.fontFamily,
            fontSize: el.fontSize,
            fontWeight: el.fontWeight,
          }}
        >
          {el.text}
        </span>
      )}
      {el.type === "rect" && (
        <div className="h-full w-full rounded-md" style={{ backgroundColor: el.color }} />
      )}
      {(el.type === "circle" || el.type === "ellipse") && (
        <div className="h-full w-full rounded-full" style={{ backgroundColor: el.color }} />
      )}
      {el.type === "triangle" && (
        <div
          className="h-full w-full"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            backgroundColor: el.color,
          }}
        />
      )}
      {el.type === "line" && (
        <div
          className="h-full"
          style={{
            backgroundColor: el.color,
            height: "2px",
          }}
        />
      )}
      {el.type === "image" && (
        <img
          src={el.src || "/placeholder.svg"}
          alt={el.name}
          className="h-full w-full object-contain"
          draggable={false}
          crossOrigin="anonymous"
        />
      )}
    </div>
  )
}
