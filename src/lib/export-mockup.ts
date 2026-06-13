import type { DesignElement } from "@/lib/editor-types"

export const FRAME_WIDTH = 440
export const FRAME_HEIGHT = 520
const MOCKUP_SRC = "/tshirt-mockup.png"

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Renders the t-shirt mockup base plus every design element onto an
 * offscreen canvas and triggers a PNG download.
 */
export async function exportMockup(
  elements: DesignElement[],
  fileName = "mockup",
  scale = 2,
): Promise<void> {
  const canvas = document.createElement("canvas")
  canvas.width = FRAME_WIDTH * scale
  canvas.height = FRAME_HEIGHT * scale
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.scale(scale, scale)

  // Background matches the editor frame surface (#1b1b1b)
  ctx.fillStyle = "#1b1b1b"
  ctx.fillRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT)

  // Draw the mockup base image
  try {
    const base = await loadImage(MOCKUP_SRC)
    ctx.drawImage(base, 0, 0, FRAME_WIDTH, FRAME_HEIGHT)
  } catch {
    // If the base fails to load, continue with just the design.
  }

  // Preload all image elements in parallel
  const imageCache = new Map<string, HTMLImageElement>()
  await Promise.all(
    elements
      .filter((el) => el.type === "image" && el.src)
      .map(async (el) => {
        try {
          imageCache.set(el.src as string, await loadImage(el.src as string))
        } catch {
          /* ignore individual image failures */
        }
      }),
  )

  // Draw each element in order (clipped to the frame bounds)
  for (const el of elements) {
    ctx.save()
    ctx.globalAlpha = el.opacity

    // Rotate around the element center
    const cx = el.x + el.width / 2
    const cy = el.y + el.height / 2
    ctx.translate(cx, cy)
    ctx.rotate((el.rotation * Math.PI) / 180)
    ctx.translate(-cx, -cy)

    if (el.type === "text") {
      const weight = el.fontWeight ?? 600
      const size = el.fontSize ?? 24
      const family = el.fontFamily ?? "sans-serif"
      ctx.fillStyle = el.color
      ctx.font = `${weight} ${size}px ${family}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(el.text ?? "", cx, cy, el.width)
    } else if (el.type === "rect") {
      ctx.fillStyle = el.color
      roundRect(ctx, el.x, el.y, el.width, el.height, 6)
      ctx.fill()
    } else if (el.type === "ellipse") {
      ctx.fillStyle = el.color
      ctx.beginPath()
      ctx.ellipse(cx, cy, el.width / 2, el.height / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    } else if (el.type === "image" && el.src) {
      const img = imageCache.get(el.src)
      if (img) {
        // object-contain behavior
        const ratio = Math.min(el.width / img.width, el.height / img.height)
        const drawW = img.width * ratio
        const drawH = img.height * ratio
        ctx.drawImage(
          img,
          el.x + (el.width - drawW) / 2,
          el.y + (el.height - drawH) / 2,
          drawW,
          drawH,
        )
      }
    }

    ctx.restore()
  }

  // Trigger download
  const url = canvas.toDataURL("image/png")
  const link = document.createElement("a")
  link.href = url
  link.download = `${sanitize(fileName)}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function sanitize(name: string) {
  return name.trim().replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "mockup"
}
