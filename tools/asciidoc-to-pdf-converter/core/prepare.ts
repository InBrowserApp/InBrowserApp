import type { Conversion } from "@workspace/asciidoc"
import { preparePrintDocument } from "@workspace/web-document/print"
import { styles } from "./styles"

export function prepare(document: Conversion) {
  if (document.warnings) throw new Error("warnings")
  const source = preparePrintDocument(document.html)
  const inert = globalThis.document.createElement("template")
  inert.innerHTML = source.html
  if (inert.content.querySelector("a.include")) throw new Error("includes")
  return { ...source, css: source.css + styles }
}
