import {
  PDF_MERGER_ERROR,
  createPdfBlob,
  normalizeOutputFileName,
} from "../core/pdf-merger"

import type { PdfMergeProgress } from "../core/pdf-merger"

type PdfMergeWorkerSource = Readonly<{
  buffer: ArrayBuffer
  name: string
}>

type PdfMergeWorkerRequestMessage = Readonly<{
  id: number
  sources: readonly PdfMergeWorkerSource[]
}>

type PdfMergeWorkerResponseMessage =
  | Readonly<{
      id: number
      ok: true
      progress: PdfMergeProgress
      type: "progress"
    }>
  | Readonly<{
      id: number
      ok: true
      output: ArrayBuffer
      type: "result"
    }>
  | Readonly<{
      id: number
      message: string
      ok: false
      type: "error"
    }>

type PdfMergeResult = Readonly<{
  blob: Blob
  fileName: string
  pageCount: number
}>

type PdfMergeWorkerOptions = Readonly<{
  files: readonly File[]
  outputName: string
  pageCount: number
  onProgress?: (progress: PdfMergeProgress) => void
}>

type PendingMergeRequest = Readonly<{
  onProgress?: (progress: PdfMergeProgress) => void
  reject: (reason?: unknown) => void
  resolve: (value: ArrayBuffer) => void
}>

let mergeWorker: Worker | null = null
let nextRequestId = 0

const pendingRequests = new Map<number, PendingMergeRequest>()

function rejectAllPendingRequests(reason: unknown) {
  for (const { reject } of pendingRequests.values()) {
    reject(reason)
  }

  pendingRequests.clear()
}

function handleWorkerMessage(
  event: MessageEvent<PdfMergeWorkerResponseMessage>
) {
  const pendingRequest = pendingRequests.get(event.data.id)

  if (!pendingRequest) {
    return
  }

  if (event.data.type === "progress") {
    pendingRequest.onProgress?.(event.data.progress)
    return
  }

  pendingRequests.delete(event.data.id)

  if (event.data.ok) {
    pendingRequest.resolve(event.data.output)
    return
  }

  pendingRequest.reject(new Error(event.data.message))
}

function handleWorkerError(error: ErrorEvent) {
  const reason =
    error.error instanceof Error
      ? error.error
      : new Error(error.message || PDF_MERGER_ERROR.mergeFailed)

  rejectAllPendingRequests(reason)
  mergeWorker?.terminate()
  mergeWorker = null
}

function getMergeWorker() {
  if (typeof Worker !== "function") {
    throw new Error(PDF_MERGER_ERROR.workerUnavailable)
  }

  if (mergeWorker) {
    return mergeWorker
  }

  mergeWorker = new Worker(
    new URL("../workers/pdf-merge.worker.ts", import.meta.url),
    { type: "module" }
  )
  mergeWorker.addEventListener("message", handleWorkerMessage)
  mergeWorker.addEventListener("error", handleWorkerError)

  return mergeWorker
}

async function readMergeSources(files: readonly File[]) {
  const sources: PdfMergeWorkerSource[] = []
  const transfer: Transferable[] = []

  for (const file of files) {
    const buffer = await file.arrayBuffer()
    sources.push({ buffer, name: file.name })
    transfer.push(buffer)
  }

  return { sources, transfer }
}

async function mergePdfFilesWithWorker({
  files,
  outputName,
  pageCount,
  onProgress,
}: PdfMergeWorkerOptions): Promise<PdfMergeResult> {
  const worker = getMergeWorker()
  const { sources, transfer } = await readMergeSources(files)
  const output = await new Promise<ArrayBuffer>((resolve, reject) => {
    const id = ++nextRequestId

    pendingRequests.set(id, { onProgress, reject, resolve })
    worker.postMessage(
      {
        id,
        sources,
      } satisfies PdfMergeWorkerRequestMessage,
      transfer
    )
  })

  return {
    blob: createPdfBlob(new Uint8Array(output)),
    fileName: normalizeOutputFileName(outputName),
    pageCount,
  }
}

function terminatePdfMergeWorker() {
  rejectAllPendingRequests(new Error("PDF merge worker terminated"))
  mergeWorker?.terminate()
  mergeWorker = null
}

export { mergePdfFilesWithWorker, terminatePdfMergeWorker }
export type {
  PdfMergeResult,
  PdfMergeWorkerRequestMessage,
  PdfMergeWorkerResponseMessage,
}
