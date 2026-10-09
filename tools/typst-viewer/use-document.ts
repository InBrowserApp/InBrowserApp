import { useEffect, useState } from "react"
import type { RefObject } from "react"
import type { Reader, ReaderState } from "@workspace/pdf-reader"
import { failure } from "./core/document"
import type { Diagnostic, Messages } from "./types"

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
  const [reader, setReader] = useState<Reader | null>(null)
  const [state, setState] = useState(initial)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  useEffect(() => {
    setReader(null)
    setState(initial)
    setStatus("")
    setError("")
    setDiagnostics([])
    if (!file || !container.current) return
    if (!/\.typ$/i.test(file.name)) {
      setError(m.invalid)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    const fail = (message: string) => {
      if (signal.aborted) return
      setError(message)
      setStatus("")
      controller.abort()
    }
    setStatus(m.reading)
    void import("./compile-document")
      .then(async ({ compileDocument }) => {
        signal.throwIfAborted()
        const result = await compileDocument(file, signal, (phase) => {
          if (!signal.aborted) setStatus(m[phase])
        })
        signal.throwIfAborted()
        setDiagnostics(result.diagnostics)
        if (!result.pdf) {
          fail(m[result.error ?? "failed"])
          return
        }
        setStatus(m.loading)
        const { openReader } = await import("@workspace/pdf-reader")
        signal.throwIfAborted()
        const instance = await openReader({
          file: new Blob([result.pdf], { type: "application/pdf" }),
          container: element,
          signal,
          onChange: (update) => {
            if (!signal.aborted) setState((value) => ({ ...value, ...update }))
          },
          onPassword: () => fail(m.failed),
          onError: () => fail(m.failed),
        })
        if (signal.aborted) {
          instance.dispose()
          return
        }
        setReader(instance)
        setStatus("")
      })
      .catch((reason: unknown) =>
        fail(
          m[failure(reason) === "resource" ? "resource" : "engineUnavailable"]
        )
      )
    return () => controller.abort()
  }, [file, container, m])
  return { reader, state, status, error, diagnostics }
}
