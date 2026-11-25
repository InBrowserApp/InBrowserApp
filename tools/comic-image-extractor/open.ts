import { openComic } from "@workspace/comic"
import { ConversionError } from "@workspace/comic/errors"

export async function open(file: File, signal: AbortSignal) {
  const format = /\.cbr$/i.test(file.name)
    ? "rar"
    : /\.cb7$/i.test(file.name)
      ? "7z"
      : null
  const comic = format
    ? await (
        await import("@workspace/comic/compressed")
      ).openCompressedComic(file, format, signal, {
        preservePaths: true,
        sequentialReads: true,
      })
    : await openComic(file, signal)
  if (comic.pages.length) return comic
  await comic.dispose()
  throw new ConversionError({ code: "empty" })
}
