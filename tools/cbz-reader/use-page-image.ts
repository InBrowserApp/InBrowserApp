import { useEffect, useState } from "react"
import { failureCode } from "@workspace/cbz/pages"
import { decodeImage } from "./image"
import type { Comic, LoadedImage, PageStatus } from "./types"
import type { OpenedComic } from "./use-comic"

export function usePageImage(
  comic: Comic,
  index: number,
  initial: OpenedComic["initial"],
  report: (index: number, status: PageStatus) => void
) {
  const [loaded, setLoaded] = useState<{
    index: number
    image: LoadedImage
  } | null>(null)
  useEffect(() => {
    setLoaded(null)
    if (index === initial.index && initial.image) return
    const status = comic.pages[index]!.status
    if (status !== "unchecked" && status !== "ready") return
    const controller = new AbortController()
    const { signal } = controller
    let image: LoadedImage | undefined
    void comic
      .read(index, signal)
      .then((blob) => {
        signal.throwIfAborted()
        return decodeImage(blob, signal)
      })
      .then((result) => {
        image = result
        if (signal.aborted) {
          URL.revokeObjectURL(result.url)
          return
        }
        setLoaded({ index, image: result })
        report(index, "ready")
      })
      .catch((reason: unknown) => {
        if (!signal.aborted)
          report(
            index,
            failureCode(reason) === "resourceLimit"
              ? "resourceLimit"
              : "damagedPage"
          )
      })
    return () => {
      controller.abort()
      if (image) URL.revokeObjectURL(image.url)
    }
  }, [comic, index, initial, report])
  if (index === initial.index) return initial.image
  return loaded?.index === index ? loaded.image : null
}
