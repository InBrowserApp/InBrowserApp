import { openNotebook } from "@workspace/notebook"
import { notebookDocument } from "./document"
import { notebookMarkdown } from "./markdown"
import { codeScript } from "./script"
import type { Messages } from "../types"

export async function convert(file: File, signal: AbortSignal, m: Messages) {
  const notebook = await openNotebook(file, signal, true)
  signal.throwIfAborted()
  const script = codeScript(notebook)
  const result = await notebookDocument(
    notebook,
    file.name.replace(/\.ipynb$/i, ""),
    signal,
    m
  )
  const markdown = notebookMarkdown(result.document)
  signal.throwIfAborted()
  return {
    preview: result.preview,
    file: result.file,
    notes: result.notes,
    markdown,
    markdownFile: new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
    script,
    scriptFile: new Blob([script.text], { type: "text/plain;charset=utf-8" }),
  }
}
