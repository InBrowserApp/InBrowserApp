import { useEffect, useRef, useState } from "react"
import { MAX_FILE_SIZE, parseHar } from "./core/parse"
import { exampleHar } from "./sample"
import type { Capture, ImportError } from "./types"

export function useHarImport() {
  const workerRef = useRef<Worker | null>(null)
  const [capture, setCapture] = useState<Capture | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ImportError | null>(null)
  const [revision, setRevision] = useState(0)

  useEffect(() => () => workerRef.current?.terminate(), [])

  function cancel() {
    workerRef.current?.terminate()
    workerRef.current = null
    setLoading(false)
    setError(null)
  }

  function clear() {
    cancel()
    setCapture(null)
    setName(null)
  }

  function example(label: string) {
    clear()
    setCapture(parseHar(exampleHar()))
    setName(label)
    setRevision((value) => value + 1)
  }

  function open(file: File) {
    cancel()
    if (file.size > MAX_FILE_SIZE) {
      setError("tooLarge")
      return
    }
    setLoading(true)
    try {
      const worker = new Worker(
        new URL("./workers/parse.worker.ts", import.meta.url),
        { type: "module" }
      )
      workerRef.current = worker
      worker.onmessage = (
        event: MessageEvent<{ capture?: Capture; error?: string }>
      ) => {
        if (workerRef.current !== worker) return
        cancel()
        if (event.data.capture) {
          setCapture(event.data.capture)
          setName(file.name)
          setRevision((value) => value + 1)
        } else {
          const code = event.data.error
          setError(
            code === "invalidJson" ||
              code === "invalidHar" ||
              code === "noValid" ||
              code === "tooMany"
              ? code
              : "readFailed"
          )
        }
      }
      worker.onerror = () => {
        if (workerRef.current !== worker) return
        cancel()
        setError("readFailed")
      }
      worker.postMessage(file)
    } catch {
      cancel()
      setError("readFailed")
    }
  }
  return { capture, name, loading, error, revision, clear, example, open }
}
