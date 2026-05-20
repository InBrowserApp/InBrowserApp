/// <reference lib="webworker" />

import {
  QPDF_DECRYPT_FAILED,
  removePdfOwnerPassword,
} from "../core/remove-owner-password"

import type {
  RemovePdfOwnerPasswordErrorCode,
  RemovePdfOwnerPasswordWorkerRequest,
  RemovePdfOwnerPasswordWorkerResponse,
} from "./worker-types"

const workerScope = self as DedicatedWorkerGlobalScope

function toWorkerErrorCode(error: unknown): RemovePdfOwnerPasswordErrorCode {
  return error instanceof Error && error.message === QPDF_DECRYPT_FAILED
    ? QPDF_DECRYPT_FAILED
    : "UNKNOWN_ERROR"
}

async function handleRemoveOwnerPasswordRequest(
  request: RemovePdfOwnerPasswordWorkerRequest
) {
  const output = await removePdfOwnerPassword(request.file)

  return await output.arrayBuffer()
}

if (typeof workerScope !== "undefined" && "addEventListener" in workerScope) {
  workerScope.addEventListener(
    "message",
    async (event: MessageEvent<RemovePdfOwnerPasswordWorkerRequest>) => {
      try {
        const output = await handleRemoveOwnerPasswordRequest(event.data)

        workerScope.postMessage(
          {
            id: event.data.id,
            ok: true,
            output,
          } satisfies RemovePdfOwnerPasswordWorkerResponse,
          [output]
        )
      } catch (error) {
        workerScope.postMessage({
          code: toWorkerErrorCode(error),
          id: event.data.id,
          ok: false,
        } satisfies RemovePdfOwnerPasswordWorkerResponse)
      }
    }
  )
}

export { handleRemoveOwnerPasswordRequest, toWorkerErrorCode }
