import { openNotebook, preparePreview } from "@workspace/notebook"
import type { Messages } from "./types"
export { failure } from "@workspace/notebook"

export async function openDocument(
  file: File,
  signal: AbortSignal,
  messages: Messages
) {
  const notebook = await openNotebook(file, signal)
  return preparePreview(notebook, messages, signal)
}
