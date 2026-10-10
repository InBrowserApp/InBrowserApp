import { useEffect, useState } from "react"
import type { RefObject } from "react"
import type { Reader, ReaderState } from "@workspace/pdf-reader"
import { failureMessage } from "@workspace/cbz/errors"
import type { Messages } from "./types"

const initial: ReaderState = {
  page: 1,
  total: 0,
  zoom: 100,
  current: 0,
  matches: 0,
  searching: false,
  query: "",
}

export function useDocument(
  file: File | null,
  container: RefObject<HTMLDivElement | null>,
  m: Messages
) {
  const [output, setOutput] = useState<{
    source: File
    pdf: Blob
    names: string[]
    reader: Reader
  } | null>(null)
  const [state, setState] = useState(initial)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    setOutput(null)
    setState(initial)
    setError("")
    setStatus("")
    if (!file || !container.current) return
    if (!/\.cbz$/i.test(file.name) || !file.size) {
      setError(m.invalid)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    const fail = (message: string) => {
      if (signal.aborted) return
      setOutput(null)
      setError(message)
      setStatus("")
      controller.abort()
    }
    setStatus(m.pdfExport.reading)
    void import("@workspace/cbz/pdf")
      .then(async ({ preparePdf }) => {
        signal.throwIfAborted()
        const result = await preparePdf(file, signal, (progress) => {
          if (!signal.aborted)
            setStatus(
              progress.saving
                ? m.pdfExport.saving
                : m.pdfExport.converting
                    .replace("{page}", String(progress.page))
                    .replace("{total}", String(progress.total)) +
                    " " +
                    progress.name
            )
        })
        signal.throwIfAborted()
        setStatus(m.loading)
        const { openReader } = await import("@workspace/pdf-reader")
        signal.throwIfAborted()
        const reader = await openReader({
          file: result.pdf,
          container: element,
          signal,
          onChange: (update) => {
            if (!signal.aborted) setState((value) => ({ ...value, ...update }))
          },
          onPassword: () => fail(m.pdfExport.failed),
          onError: () => fail(m.pdfExport.failed),
        })
        if (signal.aborted) {
          reader.dispose()
          return
        }
        reader.zoom("page-fit")
        setOutput({ source: file, ...result, reader })
        setStatus("")
      })
      .catch((reason: unknown) => fail(failureMessage(reason, m.pdfExport)))
    return () => controller.abort()
  }, [file, container, m])
  return {
    state,
    status,
    error,
    output: output?.source === file && !error && !status ? output : null,
  }
}
