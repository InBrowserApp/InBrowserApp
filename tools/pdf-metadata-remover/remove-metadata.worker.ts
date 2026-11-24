import createQpdfModule from "@jspawn/qpdf-wasm/qpdf.js"
import qpdfWasmUrl from "@jspawn/qpdf-wasm/qpdf.wasm?url"
import { removePdfMetadata } from "./core/remove-pdf-metadata"

export type RemovalResult =
  | { status: "success"; pdf: Blob }
  | { status: "encryptedPdf" | "invalidPdf" }

const inputPath = "/working/input.pdf"
const outputPath = "/output.pdf"

async function processFile(file: File): Promise<RemovalResult> {
  let diagnostics = ""
  const qpdf = await createQpdfModule({
    locateFile: () => qpdfWasmUrl,
    stderr(character) {
      diagnostics += String.fromCharCode(character)
    },
  })
  qpdf.FS.mkdir("/working")
  qpdf.FS.mount(
    qpdf.WORKERFS,
    { blobs: [{ data: file, name: "input.pdf" }] },
    "/working"
  )

  const encryptionStatus = await qpdf.callMain(["--is-encrypted", inputPath])
  // The bundled QPDF 11 build can report an invalid password with exit code 2.
  if (
    encryptionStatus === 0 ||
    diagnostics.includes(`${inputPath}: invalid password`)
  ) {
    return { status: "encryptedPdf" }
  }

  // Resolve the active cross-reference table before loading with pdf-lib.
  // It otherwise reads objects freed by incremental saves as live objects.
  const status = await qpdf.callMain([
    "--suppress-recovery",
    "--warning-exit-0",
    inputPath,
    outputPath,
  ])
  if (status !== 0) return { status: "invalidPdf" }

  const bytes = await removePdfMetadata(
    qpdf.FS.readFile(outputPath, { encoding: "binary" })
  )
  return {
    status: "success",
    pdf: new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }),
  }
}

self.onmessage = async ({ data: file }: MessageEvent<File>) => {
  let result: RemovalResult
  try {
    result = await processFile(file)
  } catch {
    result = { status: "invalidPdf" }
  }
  self.postMessage(result)
}
