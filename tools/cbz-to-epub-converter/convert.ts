import { openComic } from "@workspace/comic"
import { ConversionError, conversionFailure } from "@workspace/comic/errors"
import { decodeImage, encodeImage } from "@workspace/comic/rasterize"
import {
  comicImageExtension,
  writeComicEpub,
} from "@workspace/ebook/write-comic-epub"
import { orientation } from "exifr"
import { extension } from "./types"
import type { Messages, Result } from "./types"

export async function convert(
  file: File,
  signal: AbortSignal,
  {
    language,
    contents,
    page: pageLabel,
  }: Pick<Messages, "contents" | "page"> & {
    language: string
  },
  onProgress: (value: { page: number; total: number } | "saving") => void
): Promise<Result> {
  const comic = /\.(?:cbr|rar)$/i.test(file.name)
    ? await (
        await import("@workspace/comic/compressed")
      ).openCompressedComic(file, "rar", signal, {
        preservePaths: true,
        sequentialReads: true,
      })
    : await openComic(file, signal)
  try {
    const total = comic.pages.length
    if (!total) throw new ConversionError({ code: "empty" })
    const number = new Intl.NumberFormat(language)
    let cover: Blob | null = null

    async function* pages() {
      for (const [index, page] of comic.pages.entries()) {
        signal.throwIfAborted()
        const position = index + 1
        onProgress({ page: position, total })
        try {
          if (page.status !== "unchecked" && page.status !== "ready")
            throw new ConversionError({ code: page.status })
          const blob = await comic.read(index, signal)
          const { image, width, height } = await prepareImage(blob)
          signal.throwIfAborted()
          cover ??= image
          yield {
            image,
            width,
            height,
            label: pageLabel.replace("{page}", number.format(position)),
          }
        } catch (reason) {
          signal.throwIfAborted()
          const { code } = conversionFailure(reason)
          throw new ConversionError({
            code: code === "damaged" ? "damagedPage" : code,
            page: position,
            name: page.name,
          })
        }
      }
      onProgress("saving")
    }

    const title = file.name.replace(extension, "").trim() || file.name
    const epub = await writeComicEpub(title, pages(), signal, {
      contents,
      language,
    })
    return {
      epub,
      total,
      first: comic.pages[0]!.name,
      last: comic.pages[total - 1]!.name,
      cover,
    }
  } finally {
    await comic.dispose()
  }
}

async function prepareImage(blob: Blob) {
  const bitmap = await decodeImage(blob)
  try {
    const exif =
      blob.type === "image/jpeg" || blob.type === "image/png"
        ? await orientation(blob).catch(() => undefined)
        : undefined
    const compatible = comicImageExtension(blob.type) && (!exif || exif === 1)
    const image = compatible
      ? blob
      : await encodeImage(bitmap, { type: "image/png" })
    return { image, width: bitmap.width, height: bitmap.height }
  } finally {
    bitmap.close()
  }
}
