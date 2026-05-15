import type {
  AvifEncodeRequest,
  AvifWorkerRequestMessage,
  AvifWorkerResponseMessage,
} from "./avif-worker-types"

type PendingAvifRequest = Readonly<{
  reject: (reason?: unknown) => void
  resolve: (value: ArrayBuffer) => void
}>

let avifWorker: Worker | null = null
let nextRequestId = 0

const pendingRequests = new Map<number, PendingAvifRequest>()

function rejectAllPendingRequests(reason: unknown) {
  for (const { reject } of pendingRequests.values()) {
    reject(reason)
  }

  pendingRequests.clear()
}

function handleWorkerMessage(event: MessageEvent<AvifWorkerResponseMessage>) {
  const pendingRequest = pendingRequests.get(event.data.id)

  if (!pendingRequest) {
    return
  }

  pendingRequests.delete(event.data.id)

  if (event.data.ok) {
    pendingRequest.resolve(event.data.buffer)
    return
  }

  pendingRequest.reject(new Error(event.data.code))
}

function handleWorkerError(error: ErrorEvent) {
  const reason =
    error.error instanceof Error
      ? error.error
      : new Error(error.message || "Worker crashed")

  rejectAllPendingRequests(reason)
  avifWorker?.terminate()
  avifWorker = null
}

function getAvifWorker() {
  if (avifWorker) {
    return avifWorker
  }

  if (typeof Worker === "undefined") {
    throw new Error("WORKER_UNSUPPORTED")
  }

  avifWorker = new Worker(new URL("./avif.worker.ts", import.meta.url), {
    type: "module",
  })

  avifWorker.addEventListener("message", handleWorkerMessage)
  avifWorker.addEventListener("error", handleWorkerError)

  return avifWorker
}

async function encodeAvifWithWorker(request: AvifEncodeRequest) {
  const worker = getAvifWorker()

  return await new Promise<ArrayBuffer>((resolve, reject) => {
    const id = ++nextRequestId

    pendingRequests.set(id, { reject, resolve })
    worker.postMessage(
      {
        id,
        request,
      } satisfies AvifWorkerRequestMessage,
      [request.pixels]
    )
  })
}

function terminateAvifWorker() {
  rejectAllPendingRequests(new Error("Worker terminated"))
  avifWorker?.terminate()
  avifWorker = null
}

export { encodeAvifWithWorker, terminateAvifWorker }
