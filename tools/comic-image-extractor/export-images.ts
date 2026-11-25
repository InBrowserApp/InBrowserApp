import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js"
import { ConversionError, conversionFailure } from "@workspace/comic/errors"
import { decodeImage, encodeImage } from "@workspace/comic/rasterize"
import type { Comic } from "@workspace/comic/types"
import { extension } from "./types"
import type { Format } from "./types"

const filenames = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/gif", "gif"],
  ["image/webp", "webp"],
  ["image/bmp", "bmp"],
  ["image/avif", "avif"],
])

function pageFilename(path: string, type: string) {
  const basename = path
    .split("/")
    .pop()!
    // oxlint-disable-next-line no-control-regex -- Use portable download names.
    .replace(/[<>:"|?*\u0000-\u001f]/g, "_")
    .trim()
  const suffix = /\.([^.]*)$/.exec(basename)!
  const existing = suffix[1]!.toLowerCase()
  const preferred = filenames.get(type)
  if (!preferred) throw new ConversionError({ code: "unsupportedPage" })
  if (
    existing === preferred ||
    (preferred === "jpg" && (existing === "jpeg" || existing === "jpe"))
  )
    return basename
  return `${basename.slice(0, suffix.index)}.${preferred}`
}

async function jpeg(blob: Blob) {
  if (blob.type === "image/jpeg") return blob
  const bitmap = await decodeImage(blob)
  try {
    return await encodeImage(
      bitmap,
      { type: "image/jpeg", quality: 0.94 },
      "#ffffff"
    )
  } finally {
    bitmap.close()
  }
}

export async function exportImages(
  comic: Comic,
  sourceName: string,
  selection: ReadonlySet<number>,
  format: Format,
  signal: AbortSignal,
  progress: (page: number, total: number) => void
) {
  const indexes = [...selection].sort((a, b) => a - b)
  async function read(index: number, position: number) {
    signal.throwIfAborted()
    const page = comic.pages[index]!
    progress(position, indexes.length)
    try {
      const original = await comic.read(index, signal)
      const blob = format === "jpg" ? await jpeg(original) : original
      signal.throwIfAborted()
      return { blob, name: pageFilename(page.name, blob.type) }
    } catch (reason) {
      signal.throwIfAborted()
      const { code } = conversionFailure(reason)
      throw new ConversionError({
        code: code === "damaged" ? "damagedPage" : code,
        page: index + 1,
        name: page.name,
      })
    }
  }

  if (indexes.length === 1) return read(indexes[0]!, 1)
  const zip = new ZipWriter(new BlobWriter("application/zip"), {
    signal,
    level: 0,
    bufferedWrite: false,
    useWebWorkers: false,
  })
  const digits = String(comic.pages.length).length
  try {
    for (const [offset, index] of indexes.entries()) {
      const { name, blob } = await read(index, offset + 1)
      const pageNumber = String(index + 1).padStart(digits, "0")
      await zip.add(`${pageNumber}-${name}`, new BlobReader(blob))
    }
    const blob = await zip.close()
    signal.throwIfAborted()
    return {
      blob,
      name: `${sourceName.replace(extension, "") || "comic"}-images.zip`,
    }
  } catch (reason) {
    await zip.close().catch(() => {})
    signal.throwIfAborted()
    throw reason
  }
}
