import { createPdfBlob, PDF_DOCUMENT_ERROR } from "../core/pdf-document"
import { createStoredZip } from "../core/zip"

import type { SplitResult } from "../components/results-card"

type WorkerOutput = Readonly<{
  bytes: Uint8Array
  name: string
}>

function createSingleResult(outputs: readonly WorkerOutput[]): SplitResult {
  const output = outputs[0]

  if (!output) {
    throw new Error(PDF_DOCUMENT_ERROR.SplitFailed)
  }

  return {
    blob: createPdfBlob(output.bytes),
    fileCount: 1,
    filename: output.name,
    kind: "pdf",
  }
}

function createZipResult(
  outputs: readonly WorkerOutput[],
  outputBaseName: string
): SplitResult {
  return {
    blob: createStoredZip(
      outputs.map((output) => ({
        data: output.bytes,
        name: output.name,
      }))
    ),
    fileCount: outputs.length,
    filename: `${outputBaseName}.zip`,
    kind: "zip",
  }
}

export { createSingleResult, createZipResult }
