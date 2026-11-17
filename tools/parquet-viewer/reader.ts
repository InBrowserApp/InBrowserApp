import type { Command, Info, Output, Response, Row } from "./types"
type Result = Info | Row[] | Output

export function createReader() {
  const worker = new Worker(
    new URL("./workers/reader.worker.ts", import.meta.url),
    { type: "module" }
  )
  let nextId = 0
  let stopped = false
  const pending = new Map<
    number,
    {
      resolve: (result: Result) => void
      reject: (reason: Error) => void
      progress?: (done: number) => void
    }
  >()
  function fail() {
    stopped = true
    pending.forEach(({ reject }) => reject(new Error("Reader stopped")))
    pending.clear()
  }
  worker.onmessage = ({ data }: MessageEvent<Response>) => {
    const request = pending.get(data.id)
    if (!request) return
    if ("progress" in data) {
      request.progress?.(data.progress)
      return
    }
    pending.delete(data.id)
    if ("error" in data) request.reject(new Error("Unable to read Parquet"))
    else request.resolve(data.result)
  }
  worker.onerror = fail
  worker.onmessageerror = fail
  return {
    request<T extends Result>(
      command: Command,
      progress?: (done: number) => void
    ) {
      if (stopped) return Promise.reject<T>(new Error("Reader stopped"))
      return new Promise<T>((resolve, reject) => {
        const id = ++nextId
        pending.set(id, {
          resolve: (result) => resolve(result as T),
          reject,
          progress,
        })
        worker.postMessage({ ...command, id })
      })
    },
    dispose() {
      worker.terminate()
      fail()
    },
  }
}
