import type {
  RemovePdfOwnerPasswordWorkerRequest,
  RemovePdfOwnerPasswordWorkerResponse,
} from "./worker-types"

let nextRequestId = 0

function removePdfOwnerPasswordWithWorker(file: Blob) {
  if (typeof Worker === "undefined") {
    throw new Error("WORKER_UNSUPPORTED")
  }

  const worker = new Worker(
    new URL("./remove-owner-password.worker.ts", import.meta.url),
    {
      type: "module",
    }
  )

  return new Promise<Blob>((resolve, reject) => {
    const id = ++nextRequestId

    function cleanup() {
      worker.removeEventListener("message", handleMessage)
      worker.removeEventListener("error", handleError)
      worker.terminate()
    }

    function handleMessage(
      event: MessageEvent<RemovePdfOwnerPasswordWorkerResponse>
    ) {
      if (event.data.id !== id) {
        return
      }

      cleanup()

      if (event.data.ok) {
        resolve(new Blob([event.data.output], { type: "application/pdf" }))
        return
      }

      reject(new Error(event.data.code))
    }

    function handleError(error: ErrorEvent) {
      cleanup()
      reject(
        error.error instanceof Error
          ? error.error
          : new Error(error.message || "UNKNOWN_ERROR")
      )
    }

    worker.addEventListener("message", handleMessage)
    worker.addEventListener("error", handleError)
    worker.postMessage({
      file,
      id,
    } satisfies RemovePdfOwnerPasswordWorkerRequest)
  })
}

export { removePdfOwnerPasswordWithWorker }
