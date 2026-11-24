import { useEffect, useState } from "react"
import { failureCode } from "@workspace/comic/pages"
import { decodeImage } from "./image"
import type { Comic, LoadedImage } from "./types"

export type OpenedComic = {
  comic: Comic
  initial: { index: number; image: LoadedImage | null }
}

export function useComic(
  file: File | null,
  extensions: readonly string[],
  open: (file: File, signal: AbortSignal) => Promise<Comic>
) {
  const [opened, setOpened] = useState<{
    file: File
    value: OpenedComic
  } | null>(null)
  const [error, setError] = useState<
    "invalid" | "empty" | ReturnType<typeof failureCode> | null
  >(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setOpened(null)
    setError(null)
    setLoading(false)
    if (!file) return
    if (
      !extensions.some((extension) =>
        file.name.toLowerCase().endsWith(extension)
      )
    ) {
      setError("invalid")
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    let comic: Comic | undefined
    let initialImage: LoadedImage | null = null
    let disposed = false
    let ready = false
    function release() {
      if (initialImage) {
        URL.revokeObjectURL(initialImage.url)
        initialImage = null
      }
      if (comic && !disposed) {
        disposed = true
        void comic.dispose()
      }
    }
    setLoading(true)
    void open(file, signal)
      .then(async (result) => {
        comic = result
        signal.throwIfAborted()
        if (!comic.pages.length) {
          setError("empty")
          return
        }
        let first = 0
        for (let index = 0; index < comic.pages.length; index++) {
          const page = comic.pages[index]!
          if (page.status !== "unchecked") continue
          try {
            const blob = await comic.read(index, signal)
            signal.throwIfAborted()
            initialImage = await decodeImage(blob, signal)
            page.status = "ready"
            first = index
            break
          } catch (reason) {
            signal.throwIfAborted()
            const code = failureCode(reason)
            if (code === "resourceLimit") throw reason
            page.status = code === "encrypted" ? "encryptedPage" : "damagedPage"
          }
        }
        signal.throwIfAborted()
        ready = true
        setOpened({
          file,
          value: { comic, initial: { index: first, image: initialImage } },
        })
      })
      .catch((reason: unknown) => {
        if (!signal.aborted) setError(failureCode(reason))
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false)
        if (signal.aborted || !ready) release()
      })
    return () => {
      controller.abort()
      release()
    }
  }, [file, extensions, open])
  return { opened: opened?.file === file ? opened.value : null, error, loading }
}
