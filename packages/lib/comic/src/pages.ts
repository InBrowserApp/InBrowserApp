import type { ArchiveEntry } from "@workspace/archive/types"
import type { ComicPage } from "./types"

const supported = new Set([
  "jpg",
  "jpeg",
  "jpe",
  "png",
  "gif",
  "webp",
  "bmp",
  "avif",
])
const images = new Set([
  ...supported,
  "tif",
  "tiff",
  "heic",
  "heif",
  "jxl",
  "jp2",
  "j2k",
  "jpf",
  "jpx",
  "psd",
  "svg",
  "svgz",
  "ico",
  "apng",
  "avifs",
  "pbm",
  "pgm",
  "ppm",
  "tga",
  "pcx",
])
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" })

type Entry = { filename: string; directory?: boolean; encrypted?: boolean }

export function comparePageNames(a: string, b: string) {
  return collator.compare(a, b) || (a < b ? -1 : a > b ? 1 : 0)
}

export function indexPages<T extends Entry>(entries: readonly T[]) {
  return entries
    .flatMap((entry, position) => {
      const name = entry.filename.replace(/\\/g, "/")
      if (
        entry.directory ||
        name
          .split("/")
          .some((part) => part.startsWith(".") || part === "__MACOSX")
      )
        return []
      const extension = /\.([^./]+)$/.exec(name)?.[1]?.toLowerCase()
      if (!extension) return []
      if (!images.has(extension)) return []
      const page: ComicPage = {
        name,
        status: entry.encrypted
          ? "encryptedPage"
          : supported.has(extension)
            ? "unchecked"
            : "unsupportedPage",
      }
      return [{ entry, page, position }]
    })
    .sort(
      (a, b) =>
        comparePageNames(a.page.name, b.page.name) || a.position - b.position
    )
}

export function indexArchivePages(entries: readonly ArchiveEntry[]) {
  return indexPages(
    entries.map((entry) => ({
      ...entry,
      filename: entry.path,
      directory: entry.kind !== "file",
    }))
  )
}

export function imageMime(bytes: Uint8Array): string | null {
  const text = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end))
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg"
  if (text(0, 8) === "\x89PNG\r\n\x1a\n") return "image/png"
  if (["GIF87a", "GIF89a"].includes(text(0, 6))) return "image/gif"
  if (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") return "image/webp"
  if (text(0, 2) === "BM") return "image/bmp"
  if (text(4, 8) === "ftyp") {
    for (let offset = 8; offset + 4 <= bytes.length; offset += 4) {
      if (offset !== 12 && ["avif", "avis"].includes(text(offset, offset + 4)))
        return "image/avif"
    }
  }
  return null
}

export async function readPageImage(blob: Blob): Promise<Blob> {
  let header = new Uint8Array(await blob.slice(0, 16).arrayBuffer())
  // AVIF can declare its image brand in the compatible-brand list.
  if (
    String.fromCharCode(...header.slice(4, 8)) === "ftyp" &&
    header.length >= 16
  ) {
    const length = new DataView(header.buffer).getUint32(0)
    if (length > 16 && length <= blob.size)
      header = new Uint8Array(await blob.slice(0, length).arrayBuffer())
  }
  const mime = imageMime(header)
  if (!mime) throw new Error("Unsupported image encoding")
  return new Blob([blob], { type: mime })
}

export function failureCode(
  reason: unknown
): "resourceLimit" | "encrypted" | "damaged" {
  const message = reason instanceof Error ? reason.message.toLowerCase() : ""
  if (
    reason instanceof RangeError ||
    message.includes("out of memory") ||
    message.includes("allocation") ||
    (message.includes("allocat") && message.includes("fail")) ||
    (message.includes("insufficient") && message.includes("memory"))
  )
    return "resourceLimit"
  if (message.includes("encrypt") || message.includes("password"))
    return "encrypted"
  return "damaged"
}
