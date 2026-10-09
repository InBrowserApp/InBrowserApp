import { RtfDocument } from "rtf-viewer"
import wasmUrl from "./vendor/rtf_parser_bg.wasm?url"

export async function openDocument(file: File, signal: AbortSignal) {
  signal.throwIfAborted()
  const header = new Uint8Array(await file.slice(0, 6).arrayBuffer())
  signal.throwIfAborted()
  if (new TextDecoder().decode(header) !== "{\\rtf1") throw new Error("invalid")
  const document = await RtfDocument.load(file, { signal, wasmUrl })
  if (signal.aborted) {
    document.destroy()
    signal.throwIfAborted()
  }
  for (let index = 0; index < document.pageCount; index++) {
    const readable = document
      .getPageLayout(index)
      .lines.some((line) =>
        line.fragments.some(
          (fragment) => fragment.kind === "image" || fragment.text.trim()
        )
      )
    if (readable) return document
  }
  document.destroy()
  throw new Error("empty")
}
