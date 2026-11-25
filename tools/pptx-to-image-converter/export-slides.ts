import { zipSync } from "fflate"

const presentationExtensions = ["pptx", "pptm", "ppsx", "ppsm", "potx", "potm"]
export const accepted = presentationExtensions.map((ext) => `.${ext}`).join(",")
export const presentationExtension = new RegExp(
  `\\.(?:${presentationExtensions.join("|")})$`,
  "i"
)

export const formats = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
} as const

export type Format = keyof typeof formats
export type Render = (
  slide: number,
  format: Format,
  scale: number,
  signal: AbortSignal
) => Promise<Blob>

export async function exportSlides(
  render: Render,
  {
    first,
    last,
    name,
    format,
    scale,
    progress,
    signal,
  }: {
    first: number
    last: number
    name: string
    format: Format
    scale: number
    progress: (done: number, total: number) => void
    signal: AbortSignal
  }
) {
  const stem =
    name
      .replace(presentationExtension, "")
      .replace(/[/\\]+/g, "_")
      .trim() || "slides"
  const total = last - first + 1
  const digits = String(last).length
  const filename = (slide: number) =>
    `${stem}-slide-${String(slide).padStart(digits, "0")}.${format}`
  if (total === 1) {
    progress(1, 1)
    return {
      blob: await render(first, format, scale, signal),
      name: filename(first),
    }
  }
  const files: Record<string, Uint8Array> = {}
  for (let slide = first; slide <= last; slide++) {
    progress(slide - first + 1, total)
    const image = await render(slide, format, scale, signal)
    files[filename(slide)] = new Uint8Array(await image.arrayBuffer())
    signal.throwIfAborted()
  }
  const bytes = zipSync(files, { level: 0 })
  return {
    blob: new Blob([bytes], { type: "application/zip" }),
    name: `${stem}-slides-${first}-${last}-${format}.zip`,
  }
}
