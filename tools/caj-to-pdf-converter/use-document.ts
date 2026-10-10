import { useEffect, useState } from "react"
import type { RefObject } from "react"
import type { Reader, ReaderState } from "@workspace/pdf-reader"
import type { ConversionReport } from "@workspace/caj"
import { failureMessage } from "@workspace/caj/failure"
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
  const [output, setOutput] = useState<{ source: File; pdf: Blob } | null>(null)
  const [reader, setReader] = useState<Reader | null>(null)
  const [report, setReport] = useState<ConversionReport | null>(null)
  const [state, setState] = useState(initial)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    setOutput(null)
    setReader(null)
    setReport(null)
    setState(initial)
    setError("")
    setStatus("")
    if (!file || !container.current) return
    if (!/\.(caj|kdh|nh)$/i.test(file.name) || !file.size) {
      setError(m.invalid)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    setStatus(m.loading)
    const fail = (message: string) => {
      if (signal.aborted) return
      setOutput(null)
      setError(message)
      setStatus("")
      controller.abort()
    }
    void Promise.all([
      import("@workspace/caj"),
      import("@workspace/pdf-reader"),
    ])
      .then(async ([{ prepareDocument }, { openReader }]) => {
        signal.throwIfAborted()
        const prepared = await prepareDocument(file, signal, (progress) => {
          if (!signal.aborted)
            setStatus(
              progress === null
                ? m.inspecting
                : m.converting.replace(
                    "{progress}",
                    String(Math.round(progress * 100))
                  )
            )
        })
        signal.throwIfAborted()
        setStatus(m.loading)
        const instance = await openReader({
          file: prepared.file,
          container: element,
          signal,
          onChange: (update) => {
            if (!signal.aborted) setState((value) => ({ ...value, ...update }))
          },
          onPassword: () => fail(m.protected),
          onError: () => fail(m.missingPages),
        })
        if (signal.aborted) {
          instance.dispose()
          return
        }
        setOutput({ source: file, pdf: prepared.file })
        setReader(instance)
        setReport(prepared.report)
        setStatus("")
      })
      .catch((reason: unknown) => fail(failureMessage(reason, m)))
    return () => controller.abort()
  }, [file, container, m])
  return {
    reader,
    report,
    state,
    status,
    error,
    pdf: output?.source === file && !error && !status ? output.pdf : null,
  }
}
