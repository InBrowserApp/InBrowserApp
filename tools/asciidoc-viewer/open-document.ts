import { readAsciiDoc } from "@workspace/asciidoc"
import { preparePreview } from "./prepare-preview"
import type { Messages } from "./types"
export { failure } from "@workspace/asciidoc"

export async function openDocument(
  file: File,
  signal: AbortSignal,
  messages: Messages
) {
  const result = await readAsciiDoc(file, signal)
  return preparePreview(result, messages)
}
