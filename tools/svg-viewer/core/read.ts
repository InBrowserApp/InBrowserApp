import { prepare } from "./prepare"
import type { Failure } from "../types"

export function failure(reason: unknown): Failure {
  if (
    reason instanceof RangeError ||
    (reason instanceof Error &&
      /memory|allocation|out of resources/i.test(reason.message))
  )
    return "resourceLimit"
  if (reason instanceof Error) {
    if (reason.message === "DOCTYPE") return "doctype"
    if (reason.message === "ENCODING") return "encoding"
    if (reason.message === "COMPRESSION") return "compression"
  }
  return "invalid"
}

function decode(bytes: Uint8Array) {
  let encoding = "utf-8"
  if (
    (bytes[0] === 0xff && bytes[1] === 0xfe) ||
    (bytes[0] === 0x3c && bytes[1] === 0)
  )
    encoding = "utf-16le"
  else if (
    (bytes[0] === 0xfe && bytes[1] === 0xff) ||
    (bytes[0] === 0 && bytes[1] === 0x3c)
  )
    encoding = "utf-16be"
  else
    encoding =
      new TextDecoder()
        .decode(bytes.subarray(0, 1024))
        .match(/^\s*<\?xml[^>]*\bencoding\s*=\s*["']([^"']+)/)?.[1] || encoding
  try {
    return new TextDecoder(encoding, { fatal: true }).decode(bytes)
  } catch (reason) {
    if (
      reason instanceof TypeError ||
      (reason instanceof RangeError && /encoding/i.test(reason.message))
    )
      throw new Error("ENCODING")
    throw reason
  }
}

export async function read(file: File) {
  let bytes = new Uint8Array(await file.arrayBuffer())
  const compressed = bytes[0] === 0x1f && bytes[1] === 0x8b
  if (compressed) {
    try {
      const stream = new Blob([bytes])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"))
      bytes = new Uint8Array(await new Response(stream).arrayBuffer())
    } catch (reason) {
      if (failure(reason) === "resourceLimit") throw reason
      throw new Error("COMPRESSION")
    }
  } else if (/\.svgz$/i.test(file.name)) throw new Error("COMPRESSION")
  return prepare(decode(bytes))
}
