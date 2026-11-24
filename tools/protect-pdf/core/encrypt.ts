import createQpdfModule from "@jspawn/qpdf-wasm/qpdf.js"
import qpdfWasmUrl from "@jspawn/qpdf-wasm/qpdf.wasm?url"

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  )
}

export async function encryptPdf(file: Blob, password: string) {
  const passwordBytes = new TextEncoder().encode(password)
  if (!password || password.includes("\0") || passwordBytes.length > 127) {
    throw new Error("Invalid PDF opening password")
  }
  const qpdf = await createQpdfModule({ locateFile: () => qpdfWasmUrl })
  qpdf.FS.mkdir("/working")
  qpdf.FS.mount(
    qpdf.WORKERFS,
    { blobs: [{ data: file, name: "input.pdf" }] },
    "/working"
  )

  // An empty owner password would let a reader open the PDF without a password.
  const ownerPassword = crypto.getRandomValues(new Uint8Array(32))
  const exitCode = await qpdf.callMain([
    // Hex prevents qpdf from reading passwords such as @file as CLI arguments.
    "--password-mode=hex-bytes",
    "--encrypt",
    toHex(passwordBytes),
    toHex(ownerPassword),
    "256",
    "--",
    "/working/input.pdf",
    "/protected.pdf",
  ])
  if (exitCode !== 0) throw new Error("PDF encryption failed")

  const output = qpdf.FS.readFile("/protected.pdf", { encoding: "binary" })
  return new Blob([new Uint8Array(output)], { type: "application/pdf" })
}
