"use client";

import type React from "react"
import { useCallback, useRef, useState, useEffect } from "react"
import { Maximize2, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DesignElement } from "@/lib/editor-types"
import { createClient } from "@/utils/supabase/client"
import { AnimatePresence, motion } from "framer-motion"
import { 
  IoSwapHorizontalOutline, 
  IoTrashOutline, 
  IoCopyOutline, 
  IoLockClosedOutline, 
  IoLockOpenOutline,
  IoRefreshOutline,
  IoCheckmarkOutline,
} from "react-icons/io5"

const supabase = createClient();

interface CanvasProps {
  elements: DesignElement[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<DesignElement>) => void
  onDelete: (id: string) => void // Secure delete prop integrated [1.1.9]
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

// Mock User Uploads cached in memory [1]
const userUploads = [
  { id: "u1", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=350&auto=format&fit=crop&q=80" },
  { id: "u2", url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=350&auto=format&fit=crop&q=80" },
  { id: "u3", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350&auto=format&fit=crop&q=80" },
];

export function Canvas({ elements, selectedId, onSelect, onUpdate, onDelete }: CanvasProps) {
  const [zoom, setZoom] = useState(1)
  const dragRef = useRef<DragState>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  // IMAGE REPLACEMENT STATES [1]
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [replaceTab, setReplaceTab] = useState<"stock" | "uploads">("stock");
  const [dbStockDesigns, setDbStockDesigns] = useState<any[]>([]);
  const replaceMenuRef = useRef<HTMLDivElement>(null);

  // Fetch live database stock designs on mount [1, 1.2.6]
  useEffect(() => {
    const fetchDesigns = async () => {
      const { data } = await supabase
        .from("stock_designs")
        .select("id, url")
        .order("created_at", { ascending: false });
      if (data) setDbStockDesigns(data);
    };
    fetchDesigns();
  }, []);

  // Close replace menu on click outside [1.2.2]
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (replaceMenuRef.current && !replaceMenuRef.current.contains(event.target as Node)) {
        setReplaceTargetId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  };

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
  };

  // HIGH-PERFORMANCE POINTER ROTATOR (Calculates angle relative to element center) [1, 1.2.2]
  const startRotate = (e: React.PointerEvent, el: DesignElement) => {
    e.stopPropagation();
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);

    const rect = handle.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - centerX;
      const dy = moveEvent.clientY - centerY;
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = (angleRad * 180) / Math.PI + 90;
      onUpdate(el.id, { rotation: angleDeg });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      try {
        handle.releasePointerCapture(upEvent.pointerId);
      } catch {
        // Fallback
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleDuplicate = (e: React.MouseEvent, el: DesignElement) => {
    e.stopPropagation();
    const duplicateId = `el-${Date.now()}`;
    const duplicate: DesignElement = {
      ...el,
      id: duplicateId,
      x: el.x + 20,
      y: el.y + 20,
      name: `${el.name} (Copy)`,
    };
    elements.push(duplicate); // Pushes safely to active layout array [1]
    onSelect(duplicateId);
  };

  return (
    <div
      className="canvas-grid canvas-noise relative flex flex-1 items-center justify-center overflow-hidden editor-canvas-bg"
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerDown={() => onSelect(null)}
    >
      {/* Radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7))]" />

      {/* Mockup frame */}
      <div
        className="relative transition-transform duration-200"
        style={{ transform: `scale(${zoom})` }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div
          ref={frameRef}
          className="relative h-[520px] w-[440px] select-none rounded-3xl border border-white/8 bg-[#1b1b1b] shadow-[0_40px_100px_-20px_rgba(233,32,79,0.15),0_20px_60px_-30px_rgba(0,0,0,0.9)]"
        >
          {/* Frame Label */}
          <div className="absolute -top-7 left-0 flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-300">T-Shirt Mockup</span>
            <span className="font-medium">440 × 520</span>
          </div>

          {/* Mockup Base Image */}
          <img
            src="/tshirt-mockup.png"
            alt="Blank t-shirt product mockup base"
            className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover opacity-95"
            crossOrigin="anonymous"
          />

          {/* Print Area Guide */}
          <div className="pointer-events-none absolute left-1/2 top-[34%] h-[210px] w-[200px] -translate-x-1/2 rounded-md border border-dashed border-[#e9204f]/35" />

          {/* Design elements clipped to frame */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {elements.map((el) => (
              <ElementView
                key={el.id}
                el={el}
                selected={el.id === selectedId}
                onPointerDown={(e) => startMove(e, el)}
              />
            ))}
          </div>

          {/* Selection Bounding Box & Floating Menu controls [1] */}
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
                {/* Custom Double-Outline for high contrast */}
                <div className="absolute inset-0 rounded-[2px] outline outline-2 outline-[#e9204f] shadow-[0_0_0_3px_rgba(233,32,79,0.1),0_0_20px_rgba(233,32,79,0.25)]" />
                
                {/* Dimensions Badge */}
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-lg bg-[#e9204f] px-2.5 py-1 text-[10px] font-bold text-white shadow-lg shadow-[#e9204f]/30">
                  {Math.round(el.width)} × {Math.round(el.height)}
                </span>

                {/* Floating Context-Aware Quick Action Toolbar */}
                <div 
                  style={{ transform: `rotate(${-el.rotation}deg)` }}
                  className="absolute left-1/2 -top-14 -translate-x-1/2 z-50 bg-[#0a0a0a]/60 border border-white/10 backdrop-blur-xl rounded-2xl px-2 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto select-none"
                >
                  {/* Image Swapper Option (Visible only on Image layers) [1] */}
                  {el.type === "image" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplaceTargetId(replaceTargetId === el.id ? null : el.id);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-[#e9204f] transition duration-150 cursor-pointer active:scale-95"
                        title="Replace Design"
                      >
                        <IoSwapHorizontalOutline size={15} className={replaceTargetId === el.id ? "text-[#e9204f]" : ""} />
                      </button>
                      <div className="h-5 w-px bg-white/5 mx-0.5" />
                    </>
                  )}

                  {/* Duplicate Action [1] */}
                  <button
                    onClick={(e) => handleDuplicate(e, el)}
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition duration-150 cursor-pointer active:scale-95"
                    title="Duplicate Layer"
                  >
                    <IoCopyOutline size={15} />
                  </button>

                  <div className="h-5 w-px bg-white/5 mx-0.5" />

                  {/* Delete Action (Connected securely to onDelete prop) [1] */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(el.id);
                    }}
                    className="p-2 hover:bg-red-500/10 text-neutral-400 hover:text-[#e9204f] rounded-lg transition duration-150 cursor-pointer active:scale-95"
                    title="Delete Element"
                  >
                    <IoTrashOutline size={15} />
                  </button>
                </div>

                {/* ============================================================================
                   B. IMAGE SWAPPER SUB-DRAWER [1]
                   ============================================================================ */}
                <AnimatePresence>
                  {replaceTargetId === el.id && el.type === "image" && (
                    <div
                      ref={replaceMenuRef}
                      style={{ 
                        transform: `rotate(${-el.rotation}deg)`,
                        top: "calc(100% + 18px)" // Renders underneath to prevent overlap [1]
                      }}
                      className="absolute left-1/2 -translate-x-1/2 z-50 bg-[#131315]/95 border border-white/5 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3 w-64 pointer-events-auto select-none"
                    >
                      {/* Tab selection switcher */}
                      <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setReplaceTab("stock"); }}
                          className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md text-center cursor-pointer transition ${
                            replaceTab === "stock" ? "bg-white text-black font-black" : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Stock Art
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setReplaceTab("uploads"); }}
                          className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md text-center cursor-pointer transition ${
                            replaceTab === "uploads" ? "bg-white text-black font-black" : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          My Uploads
                        </button>
                      </div>

                      {/* Design selection list [1] */}
                      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {replaceTab === "stock" ? (
                          dbStockDesigns.map((asset) => (
                            <button
                              key={asset.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdate(el.id, { src: asset.url });
                                setReplaceTargetId(null);
                              }}
                              className="relative w-12 h-12 bg-neutral-900 border border-white/5 rounded-lg overflow-hidden shrink-0 hover:border-[#e9204f]/40 cursor-pointer transition flex items-center justify-center"
                            >
                              <img src={asset.url} alt={asset.name} className="max-w-full max-h-full object-contain p-1" />
                            </button>
                          ))
                        ) : (
                          userUploads.map((asset) => (
                            <button
                              key={asset.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdate(el.id, { src: asset.url });
                                setReplaceTargetId(null);
                              }}
                              className="relative w-12 h-12 bg-neutral-900 border border-white/5 rounded-lg overflow-hidden shrink-0 hover:border-[#e9204f]/40 cursor-pointer transition flex items-center justify-center"
                            >
                              <img src={asset.url} alt="User Upload" className="max-w-full max-h-full object-contain p-1" />
                            </button>
                          ))
                        )}
                        {replaceTab === "stock" && dbStockDesigns.length === 0 && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 py-3 mx-auto">No stock designs</span>
                        )}
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Sizer Handles */}
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

                {/* Suspended Dashed Rotation Knob */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
                  {/* Dashed connective trace */}
                  <div className="h-7 w-px border-l border-dashed border-[#e9204f]/40" />
                  
                  {/* Rotating handle trigger */}
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

      {/* Drag hint (HUD Glass) */}
      <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-white/5 bg-[#0a0a0a]/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 backdrop-blur-xl">
        Drag to move · Handles to resize · Rotation handle above
      </div>

      {/* Zoom controls (HUD Glass) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 rounded-2xl border border-white/5 bg-[#0a0a0a]/40 px-2 py-2 backdrop-blur-xl">
        <button
          onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))}
          className="flex size-9 items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          aria-label="Zoom out"
          title="Zoom Out"
        >
          <Minus className="size-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="min-w-14 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))}
          className="flex size-9 items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          aria-label="Zoom in"
          title="Zoom In"
        >
          <Plus className="size-4" />
        </button>
        <div className="mx-1.5 h-6 w-px bg-white/5" />
        <button
          onClick={() => setZoom(1)}
          className="flex size-9 items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          aria-label="Fit to screen"
          title="Fit to Screen"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>
    </div>
  )
}

function ElementView({
  el,
  selected,
  onPointerDown,
}: {
  el: DesignElement
  selected: boolean
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
      {el.type === "ellipse" && (
        <div className="h-full w-full rounded-full" style={{ backgroundColor: el.color }} />
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
