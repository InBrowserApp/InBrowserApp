import { generate, ident, parse, walk } from "css-tree"
import type { CssNode } from "css-tree"

const properties = new Set(
  `alignment-baseline baseline-shift clip clip-path clip-rule color color-interpolation color-interpolation-filters color-rendering cx cy d direction display dominant-baseline fill fill-opacity fill-rule filter flood-color flood-opacity font font-family font-size font-size-adjust font-stretch font-style font-variant font-weight height image-rendering isolation letter-spacing lighting-color marker marker-start marker-mid marker-end mask mask-type mix-blend-mode opacity overflow paint-order r rx ry shape-rendering stop-color stop-opacity stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering transform transform-box transform-origin unicode-bidi vector-effect visibility white-space width word-spacing writing-mode x y`.split(
    " "
  )
)

export function safeValue(value: CssNode) {
  let safe = true
  walk(value, (node) => {
    if (
      node.type === "Raw" ||
      (node.type === "Url" && !node.value.startsWith("#"))
    )
      safe = false
    if (
      node.type === "Function" &&
      /^(?:var|env|attr|expression|image|image-set|paint)$/i.test(
        ident.decode(node.name)
      )
    )
      safe = false
  })
  return safe
}

export function staticCss(source: string, inline = false) {
  let omitted = false
  try {
    const ast = parse(source, {
      context: inline ? "declarationList" : "stylesheet",
    })
    walk(ast, function (node, item, list) {
      if (
        node.type === "Atrule" ||
        node.type === "Raw" ||
        (node.type === "Declaration" &&
          (!properties.has(ident.decode(node.property).toLowerCase()) ||
            !safeValue(node.value)))
      ) {
        omitted = true
        list.remove(item)
        return walk.skip
      }
      return undefined
    })
    return { css: generate(ast), omitted }
  } catch (reason) {
    if (reason instanceof RangeError) throw reason
    return { css: "", omitted: true }
  }
}

export function presentationValue(source: string) {
  try {
    return safeValue(parse(source, { context: "value" }))
  } catch (reason) {
    if (reason instanceof RangeError) throw reason
    return false
  }
}
