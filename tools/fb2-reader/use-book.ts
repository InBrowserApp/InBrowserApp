import { useEffect, useState } from "react"
import type { Messages, OpenBook } from "./types"

export function useBook(file: File | null, messages: Messages) {
  const [result, setResult] = useState<{
    file: File
    book?: OpenBook
    error?: string
  } | null>(null)
  useEffect(() => {
    setResult(null)
    if (!file) return
    const controller = new AbortController()
    let opened: OpenBook | undefined
    import("./open-book")
      .then(({ openBook }) => {
        controller.signal.throwIfAborted()
        return openBook(file, controller.signal)
      })
      .then((book) => {
        opened = book
        if (controller.signal.aborted) book.dispose()
        else setResult({ file, book })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        const key =
          error instanceof RangeError &&
          !/stack|bounds|offset/i.test(error.message)
            ? "resourceLimit"
            : error?.message
        const known = [
          "protected",
          "unsupported",
          "encoding",
          "ambiguous",
          "noBook",
          "empty",
          "resourceLimit",
        ]
        setResult({
          file,
          error: known.includes(key)
            ? messages[key as keyof Messages]
            : messages.invalid,
        })
      })
    return () => {
      controller.abort()
      opened?.dispose()
    }
  }, [file, messages])
  return result?.file === file ? result : null
}
