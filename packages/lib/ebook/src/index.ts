export type {
  ReadingBook,
  BookSnapshot,
  BookSection,
  ContentsItem,
  Destination,
} from "./types"
import type { ReadingBook } from "./types"
export async function openEbook(
  file: File,
  signal: AbortSignal
): Promise<ReadingBook> {
  signal.throwIfAborted()
  if (/\.epub$/i.test(file.name))
    return (await import("./epub/open-book")).openBook(file, signal, true)
  if (/\.(mobi|azw|azw3|prc)$/i.test(file.name))
    return (await import("./mobi/open-book")).openBook(file, signal)
  if (/\.(fb2|fbz|fb2\.zip)$/i.test(file.name))
    return (await import("./fb2/open-book")).openBook(file, signal)
  throw new Error("unsupported")
}
export { snapshotBook } from "./snapshot"
