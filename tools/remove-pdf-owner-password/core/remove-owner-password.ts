import createQpdfModule from "@jspawn/qpdf-wasm/qpdf.js"
import qpdfWasmUrl from "@jspawn/qpdf-wasm/qpdf.wasm?url"

const QPDF_DECRYPT_FAILED = "QPDF_DECRYPT_FAILED"
const INPUT_PATH = "/working/input.pdf"
const OUTPUT_PATH = "/output.pdf"

async function removePdfOwnerPassword(blob: Blob) {
  const module = await createQpdfModule({
    locateFile: () => qpdfWasmUrl,
  })

  module.FS.mkdir("/working")
  module.FS.mount(
    module.WORKERFS,
    {
      blobs: [{ data: blob, name: "input.pdf" }],
    },
    "/working"
  )

  const result = await module.callMain(["--decrypt", INPUT_PATH, OUTPUT_PATH])

  if (result !== 0) {
    throw new Error(QPDF_DECRYPT_FAILED)
  }

  const outputBuffer = module.FS.readFile(OUTPUT_PATH, {
    encoding: "binary",
  })
  const outputCopy = new Uint8Array(outputBuffer.byteLength)

  outputCopy.set(outputBuffer)

  return new Blob([outputCopy.buffer], {
    type: "application/pdf",
  })
}

export { QPDF_DECRYPT_FAILED, removePdfOwnerPassword }
