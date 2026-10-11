import { generate, ident, parse, walk } from "css-tree"
import type { CssNode, List, Selector, StyleSheet } from "css-tree"

// Document styles stay inside the content root, away from pagination scaffolds.
export function printStyles(source: string): string {
  const sheet = parse(source) as StyleSheet
  function rules(children: List<CssNode>): string {
    return children
      .toArray()
      .map((node) => {
        if (node.type === "Atrule") {
          const name = ident.decode(node.name).toLowerCase()
          if (name === "page") return "" // The export always uses A4 / 18 mm.
          if (name === "media" && node.block) {
            const query = generate(node.prelude!)
            if (/^(?:print|all)$/i.test(query))
              return rules(node.block.children)
            return "" // Screen/responsive rules do not control printed pages.
          }
          throw new Error("unsupported")
        }
        if (node.type !== "Rule" || node.prelude.type !== "SelectorList")
          throw new Error("unsupported")
        walk(node.block, (part, item, list) => {
          if (
            part.type === "Declaration" &&
            /^(?:page-)?break-(?:inside|after)$/.test(part.property) &&
            generate(part.value) === "avoid"
          )
            list.remove(item)
        })
        walk(node.prelude, (part, item, list) => {
          const root =
            part.type === "TypeSelector" && /^(html|body)$/i.test(part.name)
              ? part.name.toLowerCase()
              : part.type === "PseudoClassSelector" && part.name === "root"
                ? "html"
                : undefined
          if (root)
            list.replace(
              item,
              list.createItem({
                type: "ClassSelector",
                name: `pdf-${root}`,
              })
            )
        })
        node.prelude.children.forEach((child) => {
          const selector = child as Selector
          selector.children.prependData({ type: "Combinator", name: " " })
          selector.children.prependData({
            type: "IdSelector",
            name: "pdf-content",
          })
        })
        return generate(node)
      })
      .join("\n")
  }
  return rules(sheet.children)
}

export const reflowStyles = `
  #pdf-content .pdf-html, #pdf-content .pdf-body {
    width: auto !important; min-width: 0 !important; max-width: none !important;
    margin: 0 !important; padding: 0 !important; height: auto !important;
  }
  #pdf-content table { width: 100% !important; table-layout: fixed; display: table !important; overflow: visible !important; }
  #pdf-content th, #pdf-content td { white-space: normal !important; overflow-wrap: anywhere; }
  #pdf-content thead { display: table-row-group; }
  #pdf-content pre, #pdf-content code { white-space: pre-wrap !important; overflow-wrap: anywhere !important; overflow: visible !important; }
  #pdf-content img { max-width: 100% !important; height: auto !important; }
`
