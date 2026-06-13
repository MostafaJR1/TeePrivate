"use client"

import { useCallback, useState, useEffect, useRef } from "react"
import type { DesignElement, ToolId } from "@/lib/editor-types"
import { exportMockup } from "@/lib/export-mockup"
import { TopBar } from "@/Components/editor/top-bar"
import { CompactToolbar } from "@/Components/editor/compact-toolbar"
import { Canvas } from "@/Components/editor/canvas"
import { PropertiesPanel } from "@/Components/editor/properties-panel"

let idCounter = 100
const nextId = () => `el-${idCounter++}`

const INITIAL_ELEMENTS: DesignElement[] = [
  {
    id: "el-1",
    type: "image",
    name: "Brand Graphic",
    x: 130,
    y: 190,
    width: 180,
    height: 150,
    rotation: 0,
    opacity: 1,
    color: "#e9204f",
    src: "/sample-graphic.png",
  },
  {
    id: "el-2",
    type: "text",
    name: "Headline",
    x: 110,
    y: 360,
    width: 220,
    height: 44,
    rotation: 0,
    opacity: 1,
    color: "#ffffff",
    text: "SUMMER '26",
    fontFamily: "Impact",
    fontSize: 30,
    fontWeight: 900,
  },
]

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState<ToolId>("select")
  const [elements, setElements] = useState<DesignElement[]>(INITIAL_ELEMENTS)
  const [selectedId, setSelectedId] = useState<string | null>("el-1")
  const [projectName, setProjectName] = useState("Summer Tee Campaign")
  const [exporting, setExporting] = useState(false)
  const [mockupOpacity, setMockupOpacity] = useState(1)
  
  // Undo/Redo state with debounced history tracking
  const [history, setHistory] = useState<DesignElement[][]>([INITIAL_ELEMENTS])
  const [historyIndex, setHistoryIndex] = useState(0)
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastHistoryStateRef = useRef<DesignElement[]>(INITIAL_ELEMENTS)

  // Push state to history with debouncing to avoid tracking every micro-movement
  const pushHistory = useCallback((newElements: DesignElement[]) => {
    lastHistoryStateRef.current = newElements

    // Clear existing timeout
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current)
    }

    // Debounce: wait 500ms after last change before committing to history
    historyTimeoutRef.current = setTimeout(() => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push(lastHistoryStateRef.current)
        return newHistory
      })
      setHistoryIndex((prev) => prev + 1)
    }, 500)
  }, [historyIndex])

  // Undo
  const handleUndo = useCallback(() => {
    // Flush any pending history changes
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current)
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        if (JSON.stringify(newHistory[newHistory.length - 1]) !== JSON.stringify(lastHistoryStateRef.current)) {
          newHistory.push(lastHistoryStateRef.current)
          setHistoryIndex((prev) => prev + 1)
          return newHistory
        }
        return prev
      })
    }

    setHistoryIndex((prevIndex) => {
      const newIndex = Math.max(0, prevIndex - 1)
      setElements(history[newIndex])
      setSelectedId(null)
      return newIndex
    })
  }, [history, historyIndex])

  // Redo
  const handleRedo = useCallback(() => {
    // Flush any pending history changes first
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current)
    }

    setHistoryIndex((prevIndex) => {
      const newIndex = Math.min(history.length - 1, prevIndex + 1)
      setElements(history[newIndex])
      setSelectedId(null)
      return newIndex
    })
  }, [history])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleUndo, handleRedo])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current)
      }
    }
  }, [])

  const handleExport = useCallback(async () => {
    setExporting(true)
    setSelectedId(null)
    try {
      await exportMockup(elements, projectName)
    } finally {
      setExporting(false)
    }
  }, [elements, projectName])

  const updateElement = useCallback(
    (id: string, patch: Partial<DesignElement>) => {
      setElements((prev) => {
        const updated = prev.map((el) => (el.id === id ? { ...el, ...patch } : el))
        pushHistory(updated)
        return updated
      })
    },
    [pushHistory],
  )

  const deleteElement = useCallback((id: string) => {
    // Flush any pending history
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current)
    }

    setElements((prev) => {
      const updated = prev.filter((el) => el.id !== id)
      // Delete operations are immediately added to history (no debounce)
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1)
        newHistory.push(updated)
        setHistoryIndex((prevIdx) => prevIdx + 1)
        return newHistory
      })
      return updated
    })
    setSelectedId(null)
  }, [historyIndex])

  const handleToolChange = useCallback((tool: ToolId) => {
    setActiveTool(tool)

    // Tools that create new elements
    if (tool === "text") {
      const el: DesignElement = {
        id: nextId(),
        type: "text",
        name: "New Text",
        x: 120,
        y: 250,
        width: 200,
        height: 40,
        rotation: 0,
        opacity: 1,
        color: "#ffffff",
        text: "Your text",
        fontFamily: "Geist Sans",
        fontSize: 24,
        fontWeight: 600,
      }
      setElements((prev) => {
        const updated = [...prev, el]
        pushHistory(updated)
        return updated
      })
      setSelectedId(el.id)
    } else if (tool === "shapes") {
      // Shapes tool will now open a menu in the Canvas component
      setActiveTool("shapes")
    } else if (tool === "image") {
      // Image tool will now open a menu in the Canvas component
      setActiveTool("image")
    }
  }, [pushHistory])

  const selected = elements.find((el) => el.id === selectedId) ?? null

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      <TopBar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onExport={handleExport}
        exporting={exporting}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      <div className="flex min-h-0 flex-1 relative">
        <CompactToolbar activeTool={activeTool} onToolChange={handleToolChange} />
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={updateElement}
          onDelete={deleteElement}
          activeTool={activeTool}
          mockupOpacity={mockupOpacity}
          onAddElement={(el) => {
            setElements((prev) => {
              const updated = [...prev, el]
              pushHistory(updated)
              return updated
            })
            setSelectedId(el.id)
            setActiveTool("select")
          }}
        />
        <PropertiesPanel
          element={selected}
          onUpdate={updateElement}
          onDelete={deleteElement}
          mockupOpacity={mockupOpacity}
          onMockupOpacityChange={setMockupOpacity}
        />
      </div>
    </main>
  )
}
