import { prepareWebDocument } from "@workspace/web-document"
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

function decode(bytes: Uint8Array) {
  let encoding = ""
  if (bytes[0] === 0xff && bytes[1] === 0xfe) encoding = "utf-16le"
  else if (bytes[0] === 0xfe && bytes[1] === 0xff) encoding = "utf-16be"
  else if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)
    encoding = "utf-8"
  else if (bytes[0] === 0x3c && bytes[1] === 0) encoding = "utf-16le"
  else if (bytes[0] === 0 && bytes[1] === 0x3c) encoding = "utf-16be"
  else {
    const prefix = new TextDecoder("windows-1252").decode(
      bytes.subarray(0, 4096)
    )
    encoding =
      prefix.match(/<\?xml[^>]*\bencoding\s*=\s*["']([^"']+)/i)?.[1] || ""
    if (!encoding) {
      const metas = prefix.match(/<meta\s[^>]*>/gi) || []
      for (const meta of metas) {
        encoding =
          meta.match(/\bcharset\s*=\s*["']?\s*([^\s"'/>;]+)/i)?.[1] || ""
        if (encoding) break
      }
    }
  }
  if (encoding) {
    let decoder: TextDecoder
    try {
      decoder = new TextDecoder(encoding, { fatal: true })
    } catch {
      throw new Error("ENCODING")
    }
    return decoder.decode(bytes)
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    return new TextDecoder("windows-1252").decode(bytes)
  }
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
  const source = decode(new Uint8Array(bytes))
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
