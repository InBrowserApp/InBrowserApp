import { prepare } from "./core/prepare"

export async function openDocument(file: File, signal: AbortSignal) {
  signal.throwIfAborted()
  const bytes = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  return prepare(bytes, /\.xhtml$/i.test(file.name))
}
