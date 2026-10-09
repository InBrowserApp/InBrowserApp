import { SaxesParser } from "saxes"
import type { SaxesTagNS } from "saxes"
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate"

const namespaces = Object.fromEntries(
  [
    "office",
    "style",
    "text",
    "table",
    "draw",
    "manifest",
    "number",
    "presentation",
    "form",
    "script",
    "config",
  ].map((prefix) => [
    `urn:oasis:names:tc:opendocument:xmlns:${prefix}:1.0`,
    prefix,
  ])
)
Object.assign(namespaces, {
  "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0": "fo",
  "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0": "svg",
  "http://www.w3.org/1999/xlink": "xlink",
  "http://purl.org/dc/elements/1.1/": "dc",
  "urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0":
    "loext",
  "urn:oasis:names:tc:opendocument:xmlns:meta:1.0": "meta",
})
const textMime = "application/vnd.oasis.opendocument.text"
function xmlText(bytes: Uint8Array) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  return new TextDecoder(encoding, { fatal: true }).decode(bytes)
}
const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")

function readXml(
  xml: string,
  open: (tag: SaxesTagNS) => void,
  close?: (tag: SaxesTagNS) => void,
  text?: (value: string) => void
) {
  const parser = new SaxesParser({ xmlns: true })
  parser.on("doctype", () => {
    throw new Error("invalid")
  })
  parser.on("opentag", open)
  if (close) parser.on("closetag", close)
  if (text) {
    parser.on("text", text)
    parser.on("cdata", text)
  }
  parser.write(xml).close()
}

type Style = { parent?: string; before?: string; after?: string }

export function preflight(bytes: Uint8Array) {
  const prefixes = new Map(Object.entries(namespaces))
  const xmlns = "http://www.w3.org/2000/xmlns/"
  const name = (value: { uri: string; local: string; name: string }) => {
    if (
      !value.uri ||
      value.uri === xmlns ||
      value.uri === "http://www.w3.org/XML/1998/namespace"
    )
      return value.name
    if (!prefixes.has(value.uri))
      prefixes.set(value.uri, `extension${prefixes.size}`)
    return `${prefixes.get(value.uri)}:${value.local}`
  }
  const attrs = (tag: SaxesTagNS) =>
    Object.fromEntries(
      Object.values(tag.attributes)
        .filter((attribute) => attribute.uri !== xmlns)
        .map((attribute) => [name(attribute), attribute.value])
    )
  if (!bytes.length) throw new Error("emptyFile")
  const xmlFiles = new Set([
    "mimetype",
    "content.xml",
    "styles.xml",
    "meta.xml",
    "META-INF/manifest.xml",
  ])
  const files = unzipSync(bytes, {
    filter: (entry) => xmlFiles.has(entry.name),
  })
  if (!files["content.xml"]) throw new Error("invalid")
  let rootMime = ""
  const manifest = files["META-INF/manifest.xml"]
  if (manifest)
    readXml(xmlText(manifest), (tag) => {
      const tagName = name(tag)
      if (tagName === "manifest:encryption-data") throw new Error("protected")
      const values = attrs(tag)
      if (
        tagName === "manifest:file-entry" &&
        values["manifest:full-path"] === "/"
      )
        rootMime = values["manifest:media-type"] ?? ""
    })
  const mime = files.mimetype ? strFromU8(files.mimetype).trim() : rootMime
  if (mime && ![textMime, `${textMime}-template`].includes(mime))
    throw new Error("unsupported")
  if (rootMime && rootMime !== mime) throw new Error("invalid")
  let limited = false
  let body = false
  const imagePaths = new Set<string>()
  const styles = new Map<string, Style>()
  for (const path of ["styles.xml", "content.xml"]) {
    if (!files[path]) continue
    let current: Style | undefined
    readXml(
      xmlText(files[path]!),
      (tag) => {
        const tagName = name(tag)
        const values = attrs(tag)
        if (tagName === "style:style") {
          current = { parent: values["style:parent-style-name"] }
          styles.set(values["style:name"] ?? "", current)
        }
        if (tagName === "style:paragraph-properties" && current) {
          current.before = values["fo:break-before"]
          current.after = values["fo:break-after"]
        }
        if (tagName === "office:text") body = true
        if (tagName === "draw:image") {
          const href = values["xlink:href"]
          if (href) imagePaths.add(href)
        }
        if (
          tagName === "office:annotation" ||
          tagName === "office:script" ||
          tagName.startsWith("form:") ||
          (tagName.startsWith("draw:") &&
            !["draw:frame", "draw:image", "draw:text-box"].includes(tagName))
        )
          limited = true
      },
      (tag) => {
        if (name(tag) === "style:style") current = undefined
      }
    )
  }
  if (!body) throw new Error("unsupported")
  Object.assign(
    files,
    unzipSync(bytes, { filter: (entry) => imagePaths.has(entry.name) })
  )
  if ([...imagePaths].some((path) => !files[path])) limited = true
  function pageBreak(styleName: string, key: "before" | "after") {
    const seen = new Set<string>()
    while (styleName && !seen.has(styleName)) {
      seen.add(styleName)
      const style = styles.get(styleName)
      if (style?.[key]) return style[key] === "page"
      styleName = style?.parent ?? ""
    }
    return false
  }
  const breaks: string[] = []
  const prefix = `odt-break-${crypto.randomUUID()}-`
  const marker = (position: "before" | "after") => {
    const id = `${prefix}${breaks.length}-${position}`
    breaks.push(id)
    return `<text:bookmark text:name="${id}"/>`
  }
  // Normalize legal namespace aliases for the reader, whose parser uses
  // conventional ODF prefixes. Preserve explicit paragraph page breaks as
  // bookmarks; the safe preview turns only these generated IDs into separators.
  for (const path of [
    "styles.xml",
    "content.xml",
    "meta.xml",
    "META-INF/manifest.xml",
  ]) {
    if (!files[path]) continue
    let result = ""
    let root = true
    const after: boolean[] = []
    readXml(
      xmlText(files[path]!),
      (tag) => {
        const tagName = name(tag)
        const values = attrs(tag)
        result += `<${tagName}`
        for (const [key, value] of Object.entries(values)) {
          if (key === "xmlns" || key.startsWith("xmlns:")) continue
          result += ` ${key}="${escape(value)}"`
        }
        const declarations = root
          ? prefixes
          : new Map(
              [tag, ...Object.values(tag.attributes)]
                .filter(
                  (item) =>
                    item.uri && !namespaces[item.uri] && prefixes.has(item.uri)
                )
                .map((item) => [item.uri, prefixes.get(item.uri)!])
            )
        for (const [uri, prefix] of declarations)
          result += ` xmlns:${prefix}="${escape(uri)}"`
        root = false
        result += ">"
        const paragraph = tagName === "text:p" || tagName === "text:h"
        const style = values["text:style-name"] ?? ""
        if (paragraph && pageBreak(style, "before")) result += marker("before")
        after.push(paragraph && pageBreak(style, "after"))
      },
      (tag) => {
        if (after.pop()) result += marker("after")
        result += `</${name(tag)}>`
      },
      (value) => {
        result += escape(value)
      }
    )
    files[path] = strToU8(result)
  }
  return {
    bytes: zipSync(files, { level: 0 }),
    template: mime.endsWith("-template"),
    limited,
    breaks,
  }
}
