import { useCallback, useEffect, useRef, useState } from "react"
import type {
  Command,
  Messages,
  Metadata,
  QueryResult,
  Response,
  Structure,
} from "./types"

type Session = {
  worker: Worker
  timer?: ReturnType<typeof setTimeout>
  pending?: { id: number; resolve: (response: Response | null) => void }
}
type ErrorState = { key: keyof Messages; detail?: string }

export function useDatabase(file: File | null) {
  const session = useRef<Session | null>(null)
  const serial = useRef(0)
  const currentFile = useRef(file)
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [structure, setStructure] = useState<Structure | null>(null)
  const [busy, setBusy] = useState<Command["kind"] | null>(null)
  const [error, setError] = useState<ErrorState | null>(null)

  const stop = useCallback((error?: ErrorState) => {
    const owned = session.current
    session.current = null
    if (owned) {
      clearTimeout(owned.timer)
      owned.worker.terminate()
      owned.pending?.resolve(null)
    }
    setBusy(null)
    if (error) setError(error)
  }, [])

  const send = useCallback(
    (command: Command) => {
      const owned = session.current
      if (!owned || owned.pending) return Promise.resolve(null)
      setBusy(command.kind)
      setError(null)
      if (command.kind === "query") setResult(null)
      return new Promise<Response | null>((resolve) => {
        const id = ++serial.current
        owned.pending = { id, resolve }
        owned.timer = setTimeout(() => stop({ key: "timeout" }), 10_000)
        try {
          owned.worker.postMessage({ ...command, id })
        } catch {
          stop({ key: "workerError" })
        }
      })
    },
    [stop]
  )

  const start = useCallback(
    (source: File) => {
      let worker: Worker
      try {
        worker = new Worker(new URL("./database.worker.ts", import.meta.url), {
          type: "module",
        })
      } catch {
        setError({ key: "workerError" })
        return Promise.resolve(null)
      }
      const owned: Session = { worker }
      let opened = false
      session.current = owned
      worker.onmessage = (event: MessageEvent<Response>) => {
        const response = event.data
        if (session.current !== owned || response.id !== owned.pending?.id)
          return
        clearTimeout(owned.timer)
        const resolve = owned.pending.resolve
        owned.pending = undefined
        setBusy(null)
        if (response.kind === "error")
          setError({ key: response.error, detail: response.detail })
        else if (response.kind === "open") {
          opened = true
          setMetadata(response.metadata)
        } else if (response.kind === "query") setResult(response.result)
        else setStructure(response.structure)
        resolve(response)
        if (response.kind === "error" && !opened) stop()
      }
      worker.onerror = (event) => {
        event.preventDefault()
        if (session.current === owned) stop({ key: "workerError" })
      }
      worker.onmessageerror = () => {
        if (session.current === owned) stop({ key: "workerError" })
      }
      return send({ kind: "open", file: source })
    },
    [send, stop]
  )

  // A session belongs to exactly one file. Replacement/unmount terminates all
  // pending work; late replies from an old worker cannot affect the new file.
  useEffect(() => {
    currentFile.current = file
    setMetadata(null)
    setResult(null)
    setStructure(null)
    setError(null)
    if (file) void start(file)
    return () => stop()
  }, [file, start, stop])

  const request = useCallback(
    async (command: Exclude<Command, { kind: "open" }>) => {
      if (!file || busy) return
      if (!session.current) {
        const opened = await start(file)
        if (currentFile.current !== file || opened?.kind !== "open") return
      }
      return send(command)
    },
    [file, busy, start, send]
  )

  return {
    metadata,
    result,
    structure,
    busy,
    error,
    request,
    cancel: () => stop({ key: "cancelled" }),
  }
}
