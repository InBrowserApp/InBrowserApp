import { failure } from "./errors"
import type { Source, Session, Output, Response, Request } from "./types"

export function openWorkbook(
  source: Source,
  signal: AbortSignal
): Promise<Session> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    let worker: Worker
    let closed = false
    let nextId = 0
    const pending = new Map<
      number,
      { resolve: (output: Output) => void; reject: (reason: unknown) => void }
    >()
    const close = (reason: unknown) => {
      if (closed) return
      closed = true
      worker?.terminate()
      signal.removeEventListener("abort", abort)
      reject(reason)
      for (const request of pending.values()) request.reject(reason)
      pending.clear()
    }
    const abort = () => close(signal.reason)
    const unavailable = (reason: unknown) =>
      close(
        new Error(
          failure(reason) === "resource" ? "resource" : "engineUnavailable"
        )
      )
    const send = (message: Request) => {
      try {
        worker.postMessage(message)
      } catch (reason) {
        unavailable(reason)
      }
    }
    try {
      worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
    } catch (reason) {
      unavailable(reason)
      return
    }
    signal.addEventListener("abort", abort, { once: true })
    worker.onerror = (event) => {
      event.preventDefault()
      unavailable(new Error(event.message))
    }
    worker.onmessageerror = () => unavailable(new Error("worker message"))
    worker.onmessage = ({ data }: MessageEvent<Response>) => {
      if (closed) return
      if (data.type === "open") {
        resolve({
          sheets: data.sheets,
          export(options, requestSignal) {
            requestSignal.throwIfAborted()
            signal.throwIfAborted()
            if (closed) return Promise.reject(new Error("engineUnavailable"))
            return new Promise<Output>((done, fail) => {
              const id = ++nextId
              const cleanup = () => {
                pending.delete(id)
                requestSignal.removeEventListener("abort", cancel)
              }
              const cancel = () => {
                cleanup()
                send({ type: "cancel", id })
                fail(requestSignal.reason)
              }
              requestSignal.addEventListener("abort", cancel, { once: true })
              pending.set(id, {
                resolve: (output) => {
                  cleanup()
                  done(output)
                },
                reject: (reason) => {
                  cleanup()
                  fail(reason)
                },
              })
              send({ type: "export", id, options })
            })
          },
        })
      } else if (data.type === "error") {
        if (data.id === undefined) close(new Error(data.error))
        else pending.get(data.id)?.reject(new Error(data.error))
      } else pending.get(data.id)?.resolve(data.output)
    }
    send({ type: "open", source })
  })
}
