import TurndownService from "turndown"

export function notebookMarkdown(doc: Document) {
  const root = doc.body.cloneNode(true) as HTMLElement
  // Explicit anchors retain the shared renderer's cell and heading destinations.
  for (const target of Array.from(root.querySelectorAll("[id]"))) {
    const anchor = doc.createElement("a")
    anchor.id = target.id
    target.removeAttribute("id")
    target.before(anchor)
  }
  for (const count of root.querySelectorAll(".nb-label > span"))
    count.before(doc.createTextNode(" · "))
  const markdown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  })
  markdown.keep(["table"])
  // CommonMark readers often reject SVG data URLs in Markdown image syntax.
  // The SVG was sanitized before becoming an embedded image.
  markdown.addRule("notebookSvg", {
    filter: (node) =>
      node.nodeName === "IMG" &&
      Boolean(node.getAttribute("src")?.startsWith("data:image/svg+xml;")),
    replacement: (_content, node) => `\n\n${(node as Element).outerHTML}\n\n`,
  })
  markdown.addRule("notebookAnchors", {
    filter: (node) => node.nodeName === "A" && Boolean(node.getAttribute("id")),
    replacement: (_content, node) => (node as Element).outerHTML,
  })
  markdown.addRule("notebookSource", {
    filter: "pre",
    replacement: (_content, node) => {
      const source = node.textContent!
      let length = 3
      for (const match of source.matchAll(/`+/g))
        length = Math.max(length, match[0].length + 1)
      const fence = "`".repeat(length)
      return `\n\n${fence}\n${source}${source.endsWith("\n") ? "" : "\n"}${fence}\n\n`
    },
  })
  return markdown.turndown(root) + "\n"
}
