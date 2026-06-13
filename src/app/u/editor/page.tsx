"use client"

import { useCallback, useState } from "react"
import type { DesignElement, ToolId } from "@/lib/editor-types"
import { exportMockup } from "@/lib/export-mockup"
import { TopBar } from "@/Components/editor/top-bar"
import { ToolsSidebar } from "@/Components/editor/tools-sidebar"
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
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...patch } : el)),
      )
    },
    [],
  )

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
    setSelectedId(null)
  }, [])

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
      setElements((prev) => [...prev, el])
      setSelectedId(el.id)
    } else if (tool === "shapes") {
      const el: DesignElement = {
        id: nextId(),
        type: "rect",
        name: "Rectangle",
        x: 150,
        y: 230,
        width: 140,
        height: 140,
        rotation: 0,
        opacity: 1,
        color: "#e9204f",
      }
      setElements((prev) => [...prev, el])
      setSelectedId(el.id)
    } else if (tool === "image" || tool === "ai") {
      const el: DesignElement = {
        id: nextId(),
        type: "image",
        name: tool === "ai" ? "AI Graphic" : "Uploaded Image",
        x: 130,
        y: 200,
        width: 180,
        height: 150,
        rotation: 0,
        opacity: 1,
        color: "#e9204f",
        src: "/sample-graphic.png",
      }
      setElements((prev) => [...prev, el])
      setSelectedId(el.id)
    }
  }, [])

  const selected = elements.find((el) => el.id === selectedId) ?? null

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      <TopBar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onExport={handleExport}
        exporting={exporting}
      />
      <div className="flex min-h-0 flex-1">
        <ToolsSidebar activeTool={activeTool} onToolChange={handleToolChange} />
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={updateElement}
          onDelete={deleteElement}
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
