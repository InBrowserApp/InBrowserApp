import { useEffect, useState } from "react"
import type { loadPresentation as load } from "@tool/pptx-to-pdf-converter/presentation"
import { formats, type Render } from "./export-slides"

export const accepted = ".pptx,.pptm,.ppsx,.ppsm,.potx,.potm"
type Presentation = Awaited<ReturnType<typeof load>>
type Ready = { file: File; total: number; render: Render }
type Failure = {
  file: File
  error: "invalid" | "unsupported" | "protected" | "resource"
}

export function usePresentation(file: File | null) {
  const [result, setResult] = useState<Ready | Failure | null>(null)
  useEffect(() => {
    if (!file) return
    if (!file.size || !/\.(pptx|pptm|ppsx|ppsm|potx|potm)$/i.test(file.name)) {
      setResult({ file, error: "invalid" })
      return
    }
    const controller = new AbortController()
    let source: Presentation | undefined
    const dispose = () => {
      source?.destroy()
      source = undefined
    }
    void import("@tool/pptx-to-pdf-converter/presentation")
      .then(async ({ loadPresentation, renderSlideImage, failure }) => {
        try {
          source = await loadPresentation(file, controller.signal)
          controller.signal.throwIfAborted()
          await source.waitUntilLayoutComplete()
          controller.signal.throwIfAborted()
          if (!source.slideCount) throw new Error("Empty presentation")
          const presentation = source
          let queue: Promise<unknown> = Promise.resolve()
          const render: Render = (slide, format, scale, signal) => {
            const operation = queue
              .catch(() => {})
              .then(() => {
                signal.throwIfAborted()
                controller.signal.throwIfAborted()
                const width = (presentation.slideWidth / 9525) * scale
                const height = (presentation.slideHeight / 9525) * scale
                return renderSlideImage(
                  presentation,
                  slide - 1,
                  width,
                  height,
                  signal,
                  formats[format]
                )
              })
            queue = operation
            return operation
          }
          setResult({ file, total: source.slideCount, render })
        } catch (reason) {
          dispose()
          if (!controller.signal.aborted)
            setResult({ file, error: failure(reason).code })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ file, error: "invalid" })
      })
    return () => {
      controller.abort()
      dispose()
    }
  }, [file])
  return result?.file === file ? result : null
}
