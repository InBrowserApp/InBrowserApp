import { failureOf } from "./core/failure"
import type {
  JpegOptions,
  ImageTransform,
  ImageInfo,
  OpenedImage,
  Preview,
  Reply,
  Request,
} from "./types"

export function imageSession(file: File, signal: AbortSignal) {
  signal.throwIfAborted()
  const worker = new Worker(
    new URL("./workers/image.worker.ts", import.meta.url),
    { type: "module" }
  )
  let sequence = 0
  let stopped = false
  const pending = new Map<
    number,
    { resolve: (reply: Reply) => void; reject: (reason: Error) => void }
  >()
  function stop(reason: Error) {
    stopped = true
    worker.terminate()
    signal.removeEventListener("abort", abort)
    for (const request of pending.values()) request.reject(reason)
    pending.clear()
  }
  function abort() {
    stop(new DOMException("Aborted", "AbortError"))
  }
  signal.addEventListener("abort", abort, { once: true })
  worker.onmessage = ({ data }: MessageEvent<Reply>) => {
    const request = pending.get(data.id)
    if (!request) return
    pending.delete(data.id)
    if (data.type === "error") request.reject(new Error(data.failure))
    else request.resolve(data)
  }
  worker.onerror = (event) => {
    event.preventDefault()
    stopFailure(new Error(event.message))
  }
  worker.onmessageerror = () => stop(new Error("engineError"))
  function stopFailure(reason: unknown) {
    stop(
      new Error(
        failureOf(reason) === "resourceLimit" ? "resourceLimit" : "engineError"
      )
    )
  }
  function request(data: Request) {
    if (stopped) return Promise.reject(new Error("engineError"))
    return new Promise<Reply>((resolve, reject) => {
      pending.set(data.id, { resolve, reject })
      try {
        worker.postMessage(data)
      } catch (reason) {
        stopFailure(reason)
      }
    })
  }
  return {
    inspect: async (): Promise<ImageInfo> => {
      const reply = await request({ id: ++sequence, type: "inspect", file })
      if (reply.type !== "inspected") throw new Error("invalid")
      return reply.info
    },
    open: async (jpeg?: JpegOptions): Promise<OpenedImage> => {
      const reply = await request({ id: ++sequence, type: "open", file, jpeg })
      if (reply.type !== "opened") throw new Error("invalid")
      return reply.result
    },
    render: async (
      index: number,
      jpeg?: JpegOptions,
      transform?: ImageTransform
    ): Promise<Preview> => {
      const reply = await request({
        id: ++sequence,
        type: "render",
        index,
        jpeg,
        transform,
      })
      if (reply.type !== "rendered") throw new Error("invalid")
      return reply.preview
    },
  }
}
