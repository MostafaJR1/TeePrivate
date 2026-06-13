export type ToolId =
  | "select"
  | "move"
  | "text"
  | "shapes"
  | "image"
  | "ai"

export type ElementType = "text" | "rect" | "ellipse" | "image"

export interface DesignElement {
  id: string
  type: ElementType
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  color: string
  // text-specific
  text?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  // image-specific
  src?: string
}

export const FONT_FAMILIES = [
  "Geist Sans",
  "Inter",
  "Georgia",
  "Courier New",
  "Impact",
] as const

export const FONT_WEIGHTS = [
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Black", value: 900 },
] as const
