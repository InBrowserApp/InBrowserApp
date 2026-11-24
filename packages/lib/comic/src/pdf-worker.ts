import { convertPdf } from "./convert-pdf"
import { conversionFailure } from "./errors"
import type { Response } from "./pdf-types"

const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<File>) => void) | null
  postMessage: (response: Response) => void
}

scope.onmessage = async ({ data }) => {
  try {
    const result = await convertPdf(
      data,
      new AbortController().signal,
      (progress) => scope.postMessage({ type: "progress", progress })
    )
    scope.postMessage({ type: "result", result })
  } catch (reason) {
    scope.postMessage({ type: "error", error: conversionFailure(reason) })
  }
}
