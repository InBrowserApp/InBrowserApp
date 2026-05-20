import {
  PDF_DOCUMENT_ERROR,
  isEncryptedPdfError,
  splitPdfDocument,
} from "../core/pdf-document"

import type {
  SplitWorkerRequest,
  SplitWorkerResponse,
} from "../client/split-pdf-worker"

const workerScope = self as DedicatedWorkerGlobalScope

workerScope.onmessage = async (event: MessageEvent<SplitWorkerRequest>) => {
  try {
    const result = await splitPdfDocument(event.data)

    workerScope.postMessage({
      ok: true,
      result,
    } satisfies SplitWorkerResponse)
  } catch (error) {
    workerScope.postMessage({
      code: isEncryptedPdfError(error)
        ? PDF_DOCUMENT_ERROR.Encrypted
        : PDF_DOCUMENT_ERROR.SplitFailed,
      ok: false,
    } satisfies SplitWorkerResponse)
  }
}
