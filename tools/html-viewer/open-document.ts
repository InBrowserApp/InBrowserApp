import { decodeWebDocument, prepareWebDocument } from "@workspace/web-document"
import type { Failure, Messages } from "./types"

export function failure(reason: unknown): Failure {
  if (
    reason instanceof RangeError ||
    (reason instanceof Error &&
      /memory|allocation|out of resources/i.test(reason.message))
  )
    return "resourceLimit"
  return reason instanceof Error && reason.message === "ENCODING"
    ? "encoding"
    : "invalid"
}

export async function openDocument(
  file: File,
  signal: AbortSignal,
  m: Messages
) {
  signal.throwIfAborted()
  const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    const abort = () => {
      reader.abort()
      reject(signal.reason)
    }
    const done = () => signal.removeEventListener("abort", abort)
    signal.addEventListener("abort", abort, { once: true })
    reader.onload = () => {
      done()
      resolve(reader.result as ArrayBuffer)
    }
    reader.onerror = () => {
      done()
      reject(reader.error)
    }
    reader.onabort = done
    reader.readAsArrayBuffer(file)
  })
  signal.throwIfAborted()
  const source = decodeWebDocument(new Uint8Array(bytes))
  // Reject binary control bytes after decoding UTF-16 byte sequences.
  // oxlint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000e-\u001f]/.test(source)) throw new Error("INVALID")
  const result = prepareWebDocument(source, {
    xhtml: /\.xhtml$/i.test(file.name),
    emptyText: m.noContent,
    headingText: m.documentBody,
  })
  signal.throwIfAborted()
  return result
}
