import type { PrettierFormatRequest } from "../core/prettier-languages"

type PrettierWorkerRequestMessage = Readonly<{
  id: number
  request: PrettierFormatRequest
}>

type PrettierWorkerResponseMessage =
  | Readonly<{
      id: number
      ok: true
      formatted: string
    }>
  | Readonly<{
      id: number
      ok: false
      message: string
    }>

type PendingPrettierRequest = Readonly<{
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}>

let formatterWorker: Worker | null = null
let nextRequestId = 0

const pendingRequests = new Map<number, PendingPrettierRequest>()

function rejectAllPendingRequests(reason: unknown) {
  for (const { reject } of pendingRequests.values()) {
    reject(reason)
  }

  pendingRequests.clear()
}

function handleWorkerMessage(
  event: MessageEvent<PrettierWorkerResponseMessage>
) {
  const pendingRequest = pendingRequests.get(event.data.id)

  if (!pendingRequest) {
    return
  }

  pendingRequests.delete(event.data.id)

  if (event.data.ok) {
    pendingRequest.resolve(event.data.formatted)
    return
  }

  pendingRequest.reject(new Error(event.data.message))
}

function handleWorkerError(error: ErrorEvent) {
  const reason =
    error.error instanceof Error
      ? error.error
      : new Error(error.message || "Worker crashed")

  rejectAllPendingRequests(reason)
  formatterWorker?.terminate()
  formatterWorker = null
}

function getFormatterWorker() {
  if (formatterWorker) {
    return formatterWorker
  }

  formatterWorker = new Worker(
    new URL("../workers/prettier.worker.ts", import.meta.url),
    {
      type: "module",
    }
  )

  formatterWorker.addEventListener("message", handleWorkerMessage)
  formatterWorker.addEventListener("error", handleWorkerError)

  return formatterWorker
}

async function formatCodeWithPrettierWorker(request: PrettierFormatRequest) {
  const worker = getFormatterWorker()

  return await new Promise<string>((resolve, reject) => {
    const id = ++nextRequestId

    pendingRequests.set(id, { resolve, reject })
    worker.postMessage({
      id,
      request,
    } satisfies PrettierWorkerRequestMessage)
  })
}

function terminatePrettierWorker() {
  rejectAllPendingRequests(new Error("Worker terminated"))
  formatterWorker?.terminate()
  formatterWorker = null
}

export { formatCodeWithPrettierWorker, terminatePrettierWorker }
export type { PrettierWorkerRequestMessage, PrettierWorkerResponseMessage }
