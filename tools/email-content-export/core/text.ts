/** Only the already-sanitized reading document is passed to this serializer. */
export function readableText(root: Node): string {
  const render = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE)
      return (node.textContent || "").replace(/[\t\r\n ]+/g, " ")
    if (!(node instanceof Element)) return ""
    const tag = node.localName
    if (tag === "pre") return `\n\n${node.textContent}\n\n`
    if (tag === "br") return "\n"
    if (tag === "hr") return "\n\n"
    if (tag === "img") return node.getAttribute("alt") || ""
    const value = Array.from(node.childNodes, render).join("")
    if (tag === "a") {
      const href = node.getAttribute("href")
      return href &&
        /^(?:https?:\/\/|mailto:)/i.test(href) &&
        value.trim() !== href
        ? `${value} (${href})`
        : value
    }
    if (tag === "dt") return value.trim() + ": "
    if (tag === "dd") return value.trim() + "\n"
    if (tag === "td" || tag === "th") return value.trim() + "\t"
    if (tag === "tr") return value.replace(/\t$/, "") + "\n"
    if (tag === "blockquote")
      return (
        "\n\n" +
        value
          .trim()
          .split("\n")
          .map((line) => "> " + line)
          .join("\n") +
        "\n\n"
      )
    if (tag === "li") return "\n- " + value.trim() + "\n"
    if (
      /^(?:p|div|section|article|main|header|footer|aside|h[1-6]|ul|ol|dl|table)$/.test(
        tag
      )
    )
      return "\n\n" + value.trim() + "\n\n"
    return value
  }
  return render(root)
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
