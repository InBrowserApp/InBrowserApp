import { preparePreview } from "@workspace/markdown/sanitize"
import { preparePrintDocument } from "@workspace/web-document/print"
import { styles } from "./styles"

export function prepare(html: string) {
  const source = preparePreview(html)
  if (source.localImages || source.remoteImages) throw new Error("unsupported")
  const inert = document.createElement("template")
  inert.innerHTML = source.exportHtml
  // Preserve task states as static text before the print sanitizer removes forms.
  for (const input of inert.content.querySelectorAll("input"))
    input.replaceWith(input.hasAttribute("checked") ? "[x] " : "[ ] ")
  // A print copy includes content hidden in collapsed disclosure elements.
  for (const element of inert.content.querySelectorAll("details,summary")) {
    const block = inert.ownerDocument.createElement("div")
    block.className = `markdown-${element.localName}`
    for (const attribute of element.attributes)
      if (["id", "dir", "lang"].includes(attribute.name))
        block.setAttribute(attribute.name, attribute.value)
    block.append(...element.childNodes)
    element.replaceWith(block)
  }
  const result = preparePrintDocument(inert.innerHTML)
  return { ...result, css: result.css + styles }
}
