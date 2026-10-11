import { readAsciiDoc } from "@workspace/asciidoc"
import { prepare } from "./core/prepare"

export async function openDocument(file: File, signal: AbortSignal) {
  const document = await readAsciiDoc(file, signal)
  signal.throwIfAborted()
  return prepare(document)
}
