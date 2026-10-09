import { useEffect, useRef, useState } from "react"
import { readingDocument } from "@workspace/ui/lib/reading-document"
import type { ReadingBook } from "@workspace/ui/lib/book-reader"

export function useChapter(book: ReadingBook, index: number) {
  const [chapter, setChapter] = useState<{
    index: number
    html?: string
    limited?: boolean
    error?: "chapterError" | "resourceLimit"
  } | null>(null)
  const queue = useRef(Promise.resolve())
  useEffect(() => {
    setChapter(null)
    let cancelled = false
    let loaded = false
    const section = book.parsed.sections[index]!
    queue.current = queue.current.then(async () => {
      if (cancelled) return
      try {
        const url = await section.load()
        loaded = true
        if (!url?.startsWith("blob:")) throw new Error("chapter")
        const html = await (await fetch(url)).text()
        if (!cancelled) setChapter({ index, ...readingDocument(html) })
      } catch (error) {
        if (!cancelled)
          setChapter({
            index,
            error:
              error instanceof RangeError ? "resourceLimit" : "chapterError",
          })
      } finally {
        if (cancelled && loaded) section.unload?.()
      }
    })
    return () => {
      cancelled = true
      if (loaded) {
        section.unload?.()
        loaded = false
      }
    }
  }, [book, index])
  return chapter?.index === index ? chapter : null
}
