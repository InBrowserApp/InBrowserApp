import { useEffect, useRef, useState } from "react"
import { uniqueNames } from "./names"
import type {
  ImportResult,
  Request,
  Response,
  Source,
  TableOptions,
} from "./types"

type Entry = Source & { result?: ImportResult }

export function useConverter() {
  const worker = useRef<Worker>(null)
  const nextId = useRef(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [options, setOptions] = useState<Record<string, Partial<TableOptions>>>(
    {}
  )
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(false)
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    const instance = new Worker(
      new URL("./converter.worker.ts", import.meta.url),
      { type: "module" }
    )
    worker.current = instance
    instance.onmessage = ({ data }: MessageEvent<Response>) => {
      if (data.kind === "read") {
        setEntries((current) =>
          current.map((entry) =>
            entry.id === data.result.id
              ? { ...entry, result: data.result }
              : entry
          )
        )
      } else {
        setCreating(false)
        if (data.kind === "created") {
          setUrl(
            URL.createObjectURL(
              new Blob([data.bytes], { type: "application/vnd.sqlite3" })
            )
          )
        } else {
          setError(true)
        }
      }
    }
    instance.onerror = () => {
      setEntries((current) =>
        current.map((entry) =>
          entry.result
            ? entry
            : { ...entry, result: { id: entry.id, error: "unreadable" } }
        )
      )
      setCreating(false)
      setError(true)
    }
    return () => instance.terminate()
  }, [])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  function send(request: Request) {
    worker.current?.postMessage(request)
  }

  function invalidate() {
    setUrl(undefined)
    setError(false)
  }

  function add(files: File[]) {
    if (!files.length) return
    const sources = files.map((file) => ({ id: nextId.current++, file }))
    invalidate()
    setEntries((current) => [...current, ...sources])
    send({ kind: "read", sources })
  }

  function remove(id: number) {
    invalidate()
    setEntries((current) => current.filter((entry) => entry.id !== id))
    send({ kind: "remove", id })
  }

  function update(key: string, change: Partial<TableOptions>) {
    invalidate()
    setOptions((current) => ({
      ...current,
      [key]: { ...current[key], ...change },
    }))
  }

  const tables = entries.flatMap(({ id, result }) =>
    result && "previews" in result
      ? result.previews.map((preview, index) => {
          const key = `${id}:${index}`
          const edits = options[key]
          return {
            id,
            index,
            key,
            preview,
            name: edits?.name ?? preview.label,
            header: edits?.header ?? true,
          }
        })
      : []
  )
  const names = uniqueNames(
    tables.map((table) => table.name),
    true
  )
  const namedTables = tables.map((table, index) => ({
    ...table,
    outputName: names[index]!,
  }))
  const reading = entries.some((entry) => !entry.result)

  function create() {
    setError(false)
    setCreating(true)
    send({
      kind: "create",
      tables: namedTables.map(({ id, index, outputName: name, header }) => ({
        id,
        index,
        name,
        header,
      })),
    })
  }

  return {
    entries,
    tables: namedTables,
    reading,
    creating,
    error,
    url,
    add,
    remove,
    update,
    create,
  }
}

export type Converter = ReturnType<typeof useConverter>
