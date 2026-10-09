import { unzlibSync } from "fflate"
import { MOBI } from "foliate-js/mobi.js"
import { checkHeader } from "./header"
import type { MobiBook, OpenBook } from "./types"

function readError(error: unknown) {
  // Bounds/stack errors from malformed records are not memory exhaustion.
  if (
    error instanceof RangeError &&
    !/allocation|out of memory|invalid (?:array|string) length|arraybuffer/i.test(
      error.message
    )
  )
    return new Error("invalid")
  return error
}

export async function openBook(
  file: File,
  signal: AbortSignal
): Promise<OpenBook> {
  if (!/\.(mobi|azw|azw3|prc)$/i.test(file.name))
    throw new Error("unsupportedVariant")
  if (!file.size) throw new Error("invalid")
  await checkHeader(file, signal)
  let parsed: MobiBook | undefined
  let cover: string | null = null
  try {
    parsed = await new MOBI({ unzlib: unzlibSync }).open(file)
    signal.throwIfAborted()
    if (parsed.rendition?.layout === "pre-paginated")
      throw new Error("unsupportedLayout")
    const engine = parsed
    let closed = false
    // KF8 incrementally appends decompressed records to shared buffers. Chapter
    // loads and link resolution must not advance those buffers concurrently.
    let queue = Promise.resolve()
    function read<T>(task: () => Promise<T>) {
      const pending = queue.then(() => {
        if (closed) throw new Error("closed")
        signal.throwIfAborted()
        return task()
      })
      queue = pending.then(
        () => {},
        () => {}
      )
      return pending
    }
    const readable = engine.sections.flatMap((section, index) =>
      section.load ? [{ section, index }] : []
    )
    if (!readable.length) throw new Error("empty")
    const originalIndices = new Map(readable.map(({ index }, i) => [index, i]))
    // KF8 deliberately represents empty skeletons as non-linear placeholders.
    let missing = engine.sections.some(
      (section) => !section.load && section.linear !== "no"
    )
    try {
      const blob = await engine.getCover()
      if (blob?.size) cover = URL.createObjectURL(blob)
    } catch {
      missing = true
    }
    signal.throwIfAborted()
    return {
      title: engine.metadata.title?.trim() || file.name,
      author:
        engine.metadata.author
          ?.map((author) => author.trim())
          .filter(Boolean)
          .join(", ") ?? "",
      cover,
      missing,
      parsed: {
        toc: engine.toc,
        sections: readable.map(({ section }, index) => ({
          id: `section:${index}`,
          linear: section.linear,
          load() {
            return read(async () => {
              try {
                return await section.load!()
              } catch (error) {
                throw readError(error)
              } finally {
                // The engine owns cached chapter and asset URLs. A late load must
                // also release URLs created after the book was closed/replaced.
                if (closed || signal.aborted) engine.destroy()
              }
            })
          },
        })),
        async resolveHref(href) {
          if (/^section:\d+$/.test(href))
            return { index: Number(href.slice(8)) }
          if (
            !/^(?:filepos:\d+|kindle:pos:fid:[\dA-V]+:off:[\dA-V]+)$/i.test(
              href
            )
          )
            return null
          const destination = await read(() =>
            Promise.resolve(engine.resolveHref(href))
          )
          if (!destination) return null
          const index = originalIndices.get(destination.index)
          return index === undefined ? null : { ...destination, index }
        },
      },
      dispose() {
        closed = true
        engine.destroy()
        if (cover) URL.revokeObjectURL(cover)
      },
    }
  } catch (error) {
    parsed?.destroy()
    if (cover) URL.revokeObjectURL(cover)
    throw readError(error)
  }
}
