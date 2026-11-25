import { useEffect, useState } from "react"
import type { loadPresentation as load } from "@tool/pptx-to-pdf-converter/presentation"
import { formats, presentationExtension, type Render } from "./export-slides"

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
    if (!file.size || !presentationExtension.test(file.name)) {
      setResult({ file, error: "invalid" })
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    let source: Presentation | undefined
    const dispose = () => {
      source?.destroy()
      source = undefined
    }
    void import("@tool/pptx-to-pdf-converter/presentation")
      .then(async ({ loadPresentation, renderSlideImage, failure }) => {
        try {
          source = await loadPresentation(file, signal)
          signal.throwIfAborted()
          await source.waitUntilLayoutComplete()
          signal.throwIfAborted()
          if (!source.slideCount) throw new Error("Empty presentation")
          const presentation = source
          let queue: Promise<unknown> = Promise.resolve()
          const render: Render = (slide, format, scale, renderSignal) => {
            const operation = queue
              .catch(() => {})
              .then(() => {
                renderSignal.throwIfAborted()
                signal.throwIfAborted()
                const width = (presentation.slideWidth / 9525) * scale
                const height = (presentation.slideHeight / 9525) * scale
                return renderSlideImage(
                  presentation,
                  slide - 1,
                  width,
                  height,
                  renderSignal,
                  formats[format]
                )
              })
            queue = operation
            return operation
          }
          setResult({ file, total: source.slideCount, render })
        } catch (reason) {
          dispose()
          if (!signal.aborted) setResult({ file, error: failure(reason).code })
        }
      })
      .catch(() => {
        if (!signal.aborted) setResult({ file, error: "invalid" })
      })
    return () => {
      controller.abort()
      dispose()
    }
  }, [file])
  return result?.file === file ? result : null
}
