import { readAsciiDoc } from "@workspace/asciidoc"
import { readerStyle } from "@workspace/asciidoc/styles"
import { exportWebDocument } from "@workspace/web-document/export"

export async function convert(
  file: File,
  signal: AbortSignal,
  headingText: string
) {
  const result = await readAsciiDoc(file, signal)
  signal.throwIfAborted()
  if (result.warnings) throw new Error("warnings")
  // A template stays inert even for source passthrough HTML. Secure-mode
  // includes become links, but unavailable companion text must stop export.
  const inert = document.createElement("template")
  inert.innerHTML = result.html
  if (inert.content.querySelector("a.include")) throw new Error("includes")
  return exportWebDocument(result.html, signal, headingText, readerStyle)
}
