import { SaxesParser } from "saxes"
import { dimensions } from "./dimensions"
import { presentationValue, staticCss } from "./static-css"
import { staticRaster } from "./raster"
import type { Illustration } from "../types"

const SVG = "http://www.w3.org/2000/svg"
const XLINK = "http://www.w3.org/1999/xlink"
const XML = "http://www.w3.org/XML/1998/namespace"
const elements = new Set(
  `svg g defs desc title style a switch symbol use view path rect circle ellipse line polyline polygon text tspan textPath linearGradient radialGradient stop pattern clipPath mask marker filter feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence image`.split(
    " "
  )
)
const drawing = new Set(
  "path rect circle ellipse line polyline polygon text use image".split(" ")
)
const paint = new Set(
  "fill stroke filter mask clip-path marker marker-start marker-mid marker-end cursor".split(
    " "
  )
)
const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

export function prepare(source: string): Illustration {
  const result: Illustration = {
    svg: "",
    width: 300,
    height: 150,
    declaredWidth: "",
    declaredHeight: "",
    viewBox: "",
    absolute: false,
    omitted: false,
    empty: true,
  }
  const output: string[] = []
  const parser = new SaxesParser({ xmlns: true })
  let depth = 0
  let skipped = 0
  let definitions = 0
  let style = ""
  let inStyle = false
  parser.on("doctype", () => {
    throw new Error("DOCTYPE")
  })
  parser.on("processinginstruction", () => {
    result.omitted = true
  })
  parser.on("opentag", (tag) => {
    depth++
    if (depth === 1) {
      if (tag.local !== "svg" || tag.uri !== SVG) throw new Error("INVALID")
      result.declaredWidth = tag.attributes.width?.value || ""
      result.declaredHeight = tag.attributes.height?.value || ""
      result.viewBox = tag.attributes.viewBox?.value || ""
    }
    if (skipped || tag.uri !== SVG || !elements.has(tag.local)) {
      if (!skipped) skipped = depth
      result.omitted = true
      return
    }
    if (tag.local === "defs" || tag.local === "symbol") definitions++
    if (!definitions && drawing.has(tag.local)) result.empty = false
    const attributes: string[] = []
    let inline = ""
    for (const attr of Object.values(tag.attributes)) {
      const name = attr.local
      const value = attr.value.trim()
      if (attr.uri === "http://www.w3.org/2000/xmlns/") continue
      if (attr.uri === XML && (name === "space" || name === "lang")) {
        attributes.push(`xml:${name}="${escape(attr.value)}"`)
        continue
      }
      if (
        (attr.uri && attr.uri !== XLINK) ||
        /^on/i.test(name) ||
        ["base", "tabindex", "autofocus"].includes(name)
      ) {
        result.omitted = true
        continue
      }
      if (name === "href") {
        if (
          !(
            value.startsWith("#") ||
            (["image", "feImage"].includes(tag.local) && staticRaster(value))
          )
        ) {
          result.omitted = true
          continue
        }
      } else if (attr.uri) {
        continue
      }
      if (name === "style") {
        const css = staticCss(attr.value, true)
        inline = css.css
        result.omitted ||= css.omitted
        continue
      }
      if (depth === 1 && ["width", "height", "viewBox"].includes(name)) continue
      if (paint.has(name) && !presentationValue(value)) {
        result.omitted = true
        continue
      }
      attributes.push(
        `${attr.uri === XLINK ? "xlink:" : ""}${name}="${escape(attr.value)}"`
      )
    }
    if (depth === 1) {
      const size = dimensions(
        result.declaredWidth,
        result.declaredHeight,
        result.viewBox
      )
      Object.assign(result, {
        width: size.width,
        height: size.height,
        absolute: size.absolute,
      })
      attributes.push(
        `xmlns="${SVG}" xmlns:xlink="${XLINK}" width="${size.width}" height="${size.height}" viewBox="${size.viewBox}"`
      )
      inline += `;width:${size.width}px!important;height:${size.height}px!important`
    }
    if (inline) attributes.push(`style="${escape(inline)}"`)
    output.push(
      `<${tag.local}${attributes.length ? " " + attributes.join(" ") : ""}>`
    )
    if (tag.local === "style") {
      inStyle = true
      style = ""
    }
  })
  const text = (value: string) => {
    if (skipped) return
    if (inStyle) style += value
    else output.push(escape(value))
  }
  parser.on("text", text)
  parser.on("cdata", text)
  parser.on("closetag", (tag) => {
    if (skipped) {
      if (skipped === depth) skipped = 0
    } else {
      if (tag.local === "style") {
        const css = staticCss(style)
        result.omitted ||= css.omitted
        output.push(escape(css.css))
        inStyle = false
      }
      output.push(`</${tag.local}>`)
      if (tag.local === "defs" || tag.local === "symbol") definitions--
    }
    depth--
  })
  parser.write(source).close()
  result.svg = output.join("")
  return result
}
