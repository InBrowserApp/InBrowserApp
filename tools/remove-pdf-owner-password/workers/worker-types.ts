import type { QPDF_DECRYPT_FAILED } from "../core/remove-owner-password"

type RemovePdfOwnerPasswordErrorCode =
  | typeof QPDF_DECRYPT_FAILED
  | "UNKNOWN_ERROR"
  | "WORKER_UNSUPPORTED"

type RemovePdfOwnerPasswordWorkerRequest = Readonly<{
  file: Blob
  id: number
}>

type RemovePdfOwnerPasswordWorkerResponse =
  | Readonly<{
      id: number
      ok: true
      output: ArrayBuffer
    }>
  | Readonly<{
      code: RemovePdfOwnerPasswordErrorCode
      id: number
      ok: false
    }>

export type {
  RemovePdfOwnerPasswordErrorCode,
  RemovePdfOwnerPasswordWorkerRequest,
  RemovePdfOwnerPasswordWorkerResponse,
}
