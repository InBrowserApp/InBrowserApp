import { useCallback, useEffect, useRef, useState } from "react"
import type { Loaded, Messages, Preview, Request, Response } from "./types"

type State = {
  file: File
  info?: Loaded
  url?: string
  preview?: Preview
  error?: string
}
export function useWorkbook(file: File | null, m: Messages) {
  const worker = useRef<Worker | null>(null)
  const requestId = useRef(0)
  const [state, setState] = useState<State | null>(null)
  useEffect(() => {
    setState(null)
    if (!file) return
    if (!/\.numbers$/i.test(file.name) || !file.size) {
      setState({ file, error: m.invalid })
      return
    }
    let active = true
    let url: string | undefined
    let instance: Worker | undefined
    const fail = (error: string) => {
      if (!active) return
      if (url) {
        URL.revokeObjectURL(url)
        url = undefined
      }
      instance?.terminate()
      worker.current = null
      setState({ file, error })
    }
    try {
      instance = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
      worker.current = instance
      instance.onerror = (event) => {
        event.preventDefault()
        fail(m.engineUnavailable)
      }
      instance.onmessage = ({ data }: MessageEvent<Response>) => {
        if (!active) return
        if (data.type === "error") {
          fail(m[data.error])
          return
        }
        if (data.type === "ready") {
          try {
            url = URL.createObjectURL(
              new Blob([data.bytes], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              })
            )
            setState({ file, info: data.info, url })
          } catch {
            fail(m.resource)
          }
        } else if (data.id === requestId.current) {
          setState((current) =>
            current?.file === file
              ? { ...current, preview: data.preview }
              : current
          )
        }
      }
      instance.postMessage({ type: "open", file } satisfies Request)
    } catch {
      fail(m.engineUnavailable)
    }
    return () => {
      active = false
      instance?.terminate()
      worker.current = null
      if (url) URL.revokeObjectURL(url)
    }
  }, [file, m])
  const requestPreview = useCallback(
    (sheet: number, row: number, column: number) => {
      setState((current) =>
        current ? { ...current, preview: undefined } : current
      )
      worker.current?.postMessage({
        type: "preview",
        id: ++requestId.current,
        sheet,
        row,
        column,
      } satisfies Request)
    },
    []
  )
  const current = state?.file === file ? state : null
  return {
    info: current?.info,
    url: current?.url,
    preview: current?.preview,
    error: current?.error,
    loading: Boolean(file && !current),
    requestPreview,
  }
}
