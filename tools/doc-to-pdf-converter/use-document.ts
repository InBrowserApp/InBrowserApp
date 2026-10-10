import { useEffect, useState } from "react"
import type { RefObject } from "react"
import type { Reader, ReaderState } from "@workspace/pdf-reader"
import type { Result } from "./core/convert"
import { failure } from "./core/errors"
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
  const [output, setOutput] = useState<
    (Result & { source: File; reader: Reader }) | null
  >(null)
  const [state, setState] = useState(initial)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    setOutput(null)
    setState(initial)
    setError("")
    setStatus("")
    if (!file || !container.current) return
    if (!/\.(doc|wps|wpt)$/i.test(file.name) || !file.size) {
      setError(m.invalid)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    let phase: "engine" | "conversion" | "preview" = "engine"
    const fail = (message: string) => {
      if (signal.aborted) return
      setOutput(null)
      setError(message)
      setStatus("")
      controller.abort()
    }
    setStatus(m.reading)
    void import("./core/convert")
      .then(async ({ convert }) => {
        signal.throwIfAborted()
        phase = "conversion"
        const result = await convert(file, signal, (progress) => {
          if (signal.aborted) return
          setStatus(
            progress.saving
              ? m.saving
              : m.converting
                  .replace("{page}", String(progress.page))
                  .replace("{pages}", String(progress.pages))
          )
        })
        signal.throwIfAborted()
        phase = "preview"
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
          onPassword: () => fail(m.failed),
          onError: () => fail(m.failed),
        })
        if (signal.aborted) {
          reader.dispose()
          return
        }
        reader.zoom("page-fit")
        setOutput({ source: file, ...result, reader })
        setStatus("")
      })
      .catch((reason: unknown) => {
        if (phase === "engine") return fail(m.engineUnavailable)
        if (phase === "preview") return fail(m.failed)
        const problem = failure(reason)
        const message = m[problem.code]
        fail(
          problem.page
            ? m.pageFailure
                .replace("{page}", String(problem.page))
                .replace("{message}", message)
            : message
        )
      })
    return () => controller.abort()
  }, [file, container, m])
  return {
    state,
    status,
    error,
    output: output?.source === file && !error && !status ? output : null,
  }
}
