import { loadImage } from "./browser"
import { outputName } from "./core/files"
import { drawWatermark, encodeImage } from "./render"
import type { Options } from "./types"

export async function exportImages(
  files: readonly File[],
  logoFile: File | null,
  options: Options,
  zip: boolean,
  onProgress: (current: number) => void
) {
  const logo =
    options.kind === "image" && logoFile ? await loadImage(logoFile) : null
  const entries: Record<string, Uint8Array> = Object.create(null)
  const used = new Set<string>()
  let bytes = 0
  try {
    for (const [index, file] of files.entries()) {
      onProgress(index + 1)
      // Yield to paint progress between full-resolution images.
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
      const source = await loadImage(file)
      const canvas = document.createElement("canvas")
      try {
        drawWatermark(canvas, source, logo, options)
        const blob = await encodeImage(canvas, options)
        const name = outputName(file.name, blob.type, used)
        if (!zip) return { blob, name }
        bytes += blob.size
        if (bytes > 150 * 1024 * 1024) throw new Error("EXPORT_TOO_LARGE")
        entries[name] = new Uint8Array(await blob.arrayBuffer())
      } finally {
        source.close()
        canvas.width = canvas.height = 0
      }
    }
    const { zipSync } = await import("fflate")
    return {
      blob: new Blob([zipSync(entries, { level: 0 })], {
        type: "application/zip",
      }),
      name: "watermarked-images.zip",
    }
  } finally {
    logo?.close()
  }
}
