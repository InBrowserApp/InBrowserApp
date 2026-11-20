import {
  canvasBlob,
  loadImageSource,
} from "@workspace/raster-image/browser-canvas"
import { encodeToLimit } from "./core/target-size"

export type Format = "jpg" | "webp"

export type Result = Awaited<ReturnType<typeof compressImage>>
export type ReadyImage = Result & { name: string }

async function isMatchingStillImage(file: File, format: Format) {
  const header = new Uint8Array(await file.slice(0, 21).arrayBuffer())
  if (format === "jpg") {
    return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff
  }

  const tag = (start: number) =>
    String.fromCharCode(...header.subarray(start, start + 4))
  return (
    tag(0) === "RIFF" &&
    tag(8) === "WEBP" &&
    (tag(12) !== "VP8X" || ((header[20] ?? 0) & 2) === 0)
  )
}

export async function compressImage(
  file: File,
  format: Format,
  limit: number,
  allowResize: boolean
) {
  const source = await loadImageSource(file)
  const original = { width: source.width, height: source.height }
  const mime = format === "jpg" ? "image/jpeg" : "image/webp"

  try {
    if (file.size <= limit && (await isMatchingStillImage(file, format))) {
      return {
        blob: file.slice(0, file.size, mime),
        original,
        ...original,
        originalKept: true,
      }
    }

    const canvas = document.createElement("canvas")
    try {
      const result = await encodeToLimit(
        original,
        limit,
        allowResize,
        async (size, quality) => {
          if (
            canvas.width !== size.width ||
            canvas.height !== size.height ||
            quality === 100
          ) {
            canvas.width = size.width
            canvas.height = size.height
            const context = canvas.getContext("2d", {
              alpha: format === "webp",
            })
            if (!context) return null

            context.imageSmoothingQuality = "high"
            if (format === "jpg") {
              context.fillStyle = "#fff"
              context.fillRect(0, 0, size.width, size.height)
            }
            context.drawImage(source.image, 0, 0, size.width, size.height)
          }

          const blob = await canvasBlob(canvas, mime, quality / 100)
          if (!blob?.size) return null
          if (blob.type !== mime) throw new Error("UNSUPPORTED_FORMAT")
          return blob
        }
      )
      return { ...result, original, originalKept: false }
    } finally {
      canvas.width = 0
      canvas.height = 0
    }
  } finally {
    source.cleanup?.()
  }
}

export function outputName(file: File, format: Format, names: Set<string>) {
  const stem =
    file.name
      .replace(/\.[^.]*$/, "")
      .replace(/[<>:"/\\|?*]/g, "_")
      .trim() || "image"
  let name = `${stem}.${format}`
  for (let suffix = 2; names.has(name.toLowerCase()); suffix++) {
    name = `${stem}-${suffix}.${format}`
  }
  names.add(name.toLowerCase())
  return name
}

export async function readyImagesZip(images: readonly ReadyImage[]) {
  const { zipSync } = await import("fflate")
  const entries = await Promise.all(
    images.map(
      async ({ name, blob }) =>
        [name, new Uint8Array(await blob.arrayBuffer())] as const
    )
  )
  return new Blob([zipSync(Object.fromEntries(entries), { level: 0 })], {
    type: "application/zip",
  })
}
