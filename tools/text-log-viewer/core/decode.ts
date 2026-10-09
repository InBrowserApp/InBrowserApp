import { TextIndex } from "./text-index"
import type { Failure } from "../types"
export function failure(error: unknown): Failure {
  if (
    error instanceof RangeError ||
    (error instanceof Error &&
      /memory|allocation|string length/i.test(error.message))
  )
    return "resourceLimit"
  if (error instanceof TypeError) return "encodingError"
  if (error instanceof Error && error.message === "BINARY") return "binary"
  return "readError"
}
export async function decode(file: Blob, selected: string) {
  const prefix = new Uint8Array(await file.slice(0, 3).arrayBuffer())
  const encoding =
    selected === "auto"
      ? prefix[0] === 0xff && prefix[1] === 0xfe
        ? "utf-16le"
        : prefix[0] === 0xfe && prefix[1] === 0xff
          ? "utf-16be"
          : "utf-8"
      : selected
  const decoder = new TextDecoder(encoding, { fatal: true })
  const reader = file.stream().getReader()
  const index = new TextIndex()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      index.add(decoder.decode(value, { stream: true }))
    }
    index.add(decoder.decode())
    index.finish()
    return { index, encoding: decoder.encoding }
  } finally {
    await reader.cancel()
    reader.releaseLock()
  }
}
