import { prepareWebDocument } from "@workspace/web-document"
import { fragment } from "./fragment"
import { readerStyle } from "./reader-style"
import type { Notebook, Messages, Preview } from "./types"

export async function preparePreview(
  notebook: Notebook,
  m: Messages,
  signal: AbortSignal
): Promise<Preview> {
  const preview = prepareWebDocument("", {
    emptyText: m.noContent,
    headingText: m.markdown,
  })
  const doc = new DOMParser().parseFromString(preview.html, "text/html")
  const body = doc.body
  const outline: Preview["outline"] = []
  const prefix = `notebook-${crypto.randomUUID()}-`
  const anchors = new Map<string, string>()
  const links: { element: Element; names: Map<string, string> }[] = []
  let limited = false
  if (notebook.cells.length) body.replaceChildren()
  function element(tag: string, content = "", className = "") {
    const node = doc.createElement(tag)
    node.textContent = content
    node.className = className
    return node
  }
  for (let index = 0; index < notebook.cells.length; index++) {
    if (index % 32 === 0) await new Promise((resolve) => setTimeout(resolve, 0))
    signal.throwIfAborted()
    const cell = notebook.cells[index]!
    const section = element("section", "", "nb-cell")
    section.id = `${prefix}cell-${index}`
    const name = `${m.cell} ${index + 1} · ${m[cell.kind]}`
    const label = element("header", "", "nb-label")
    label.append(element("strong", name))
    if (cell.kind === "code")
      label.append(
        element(
          "span",
          cell.count === null ? m.notExecuted : `${m.execution} ${cell.count}`
        )
      )
    section.append(label)
    outline.push({ id: section.id, label: name, level: 1 })
    let fragmentIndex = 0
    const add = (
      parent: HTMLElement,
      html: string,
      svg?: string,
      emptyText = m.emptyCell,
      fallback = ""
    ) => {
      const clean = fragment(html, cell.attachments, m, svg)
      for (const key of ["local", "remote", "active"] as const)
        preview.notes[key] ||= clean.notes[key]
      const content = element("div", "", "nb-content")
      content.append(...Array.from(clean.body.childNodes))
      const hasContent = () =>
        content.textContent?.trim() || content.querySelector("img[src],table")
      if (!hasContent() && fallback)
        content.replaceChildren(
          ...Array.from(fragment(fallback, {}, m).body.childNodes)
        )
      const names = new Map<string, string>()
      for (const heading of content.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
        // Jupyter's heading anchors retain case and replace spaces with hyphens.
        if (!heading.id)
          heading.id = (heading.textContent || m.markdown)
            .trim()
            .replace(/\s+/g, "-")
      }
      let counter = 0
      for (const target of content.querySelectorAll("[id]")) {
        const old = target.id
        const id = `${section.id}-${fragmentIndex}-${counter++}`
        if (!names.has(old)) names.set(old, id)
        if (!anchors.has(old)) anchors.set(old, id)
        target.id = id
      }
      for (const heading of content.querySelectorAll("h1,h2,h3,h4,h5,h6"))
        outline.push({
          id: heading.id,
          label: heading.textContent?.trim() || m.markdown,
          level: 2,
        })
      for (const link of content.querySelectorAll("[data-web-link]"))
        links.push({ element: link, names })
      if (!hasContent()) content.append(element("p", emptyText, "nb-notice"))
      parent.append(content)
      fragmentIndex++
    }
    if (cell.kind === "unknownCell") {
      section.append(element("p", m.unsupportedCell, "nb-notice"))
      limited = true
    }
    if (cell.kind === "code") {
      const source = element("details", "", "nb-section") as HTMLDetailsElement
      source.open = true
      source.append(element("summary", m.code))
      add(source, cell.html)
      section.append(source)
      if (!cell.outputs.length)
        section.append(element("p", m.noOutput, "nb-notice"))
      else {
        const outputs = element(
          "details",
          "",
          "nb-section"
        ) as HTMLDetailsElement
        outputs.open = true
        outputs.append(
          element("summary", `${m.savedOutput} · ${cell.outputs.length}`)
        )
        for (const output of cell.outputs) {
          const block = element(
            "div",
            "",
            output.label === "savedError" ? "nb-output nb-error" : "nb-output"
          )
          block.append(element("div", m[output.label], "nb-output-label"))
          if (output.interactive) {
            block.append(element("p", m.interactive, "nb-notice"))
            limited = true
          }
          if (output.unsupported) {
            block.append(element("p", m.unsupportedOutput, "nb-notice"))
            limited = true
          }
          if (output.html || output.svg !== undefined || output.fallback)
            add(
              block,
              output.html,
              output.svg,
              m.unsupportedOutput,
              output.fallback
            )
          outputs.append(block)
        }
        section.append(outputs)
      }
    } else add(section, cell.html)
    body.append(section)
  }
  for (const { element: link, names } of links) {
    const href = link.getAttribute("data-web-link")!
    if (!href.startsWith("#")) continue
    let id = href.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch {
      /* Literal reference. */
    }
    const target = names.get(id) ?? anchors.get(id)
    if (target) link.setAttribute("data-web-link", `#${target}`)
  }
  const style = doc.createElement("style")
  style.textContent = readerStyle
  doc.head.append(style)
  return {
    ...preview,
    html: "<!doctype html>" + doc.documentElement.outerHTML,
    outline,
    empty: !notebook.cells.length,
    limited,
  }
}
