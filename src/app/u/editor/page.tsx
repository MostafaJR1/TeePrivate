"use client"

import { useCallback, useState, useEffect } from "react"
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
  
  // Undo/Redo state
  const [history, setHistory] = useState<DesignElement[][]>([INITIAL_ELEMENTS])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Push state to history
  const pushHistory = useCallback((newElements: DesignElement[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newElements)
      return newHistory
    })
    setHistoryIndex((prev) => prev + 1)
  }, [historyIndex])

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setElements(history[newIndex])
      setSelectedId(null)
    }
  }, [historyIndex, history])

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setElements(history[newIndex])
      setSelectedId(null)
    }
  }, [historyIndex, history])

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
    setElements((prev) => {
      const updated = prev.filter((el) => el.id !== id)
      pushHistory(updated)
      return updated
    })
    setSelectedId(null)
  }, [pushHistory])

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
        />
      </div>
    </main>
  )
}
