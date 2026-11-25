import { generate, parse, walk } from "css-tree"
import {
  encodeBase64,
  isPlistDictionary,
  parsePlistDictionary,
} from "rork-plist"
import type { PlistValue } from "rork-plist"
import { decodeWebDocument, prepareWebDocument } from "@workspace/web-document"

const embeddable =
  /^(?:image\/(?:png|jpeg|gif|webp|avif|bmp)|font\/(?:woff2?|ttf|otf)|application\/(?:font-woff|vnd\.ms-fontobject|x-font-ttf))$/

function resource(value: PlistValue | undefined) {
  if (
    !isPlistDictionary(value) ||
    !(value.WebResourceData instanceof Uint8Array) ||
    typeof value.WebResourceURL !== "string" ||
    typeof value.WebResourceMIMEType !== "string"
  ) {
    return null
  }
  const mime = value.WebResourceMIMEType
  const declaredEncoding =
    typeof value.WebResourceTextEncodingName === "string"
      ? value.WebResourceTextEncodingName.trim()
      : ""
  return {
    url: value.WebResourceURL,
    bytes: value.WebResourceData,
    type: mime.split(";", 1)[0]!.trim().toLowerCase(),
    encoding:
      declaredEncoding || /charset\s*=\s*["']?([^\s;"']+)/i.exec(mime)?.[1],
  }
}

type Resource = NonNullable<ReturnType<typeof resource>>

function decode({ bytes, encoding }: Resource) {
  if (encoding) {
    try {
      return new TextDecoder(encoding).decode(bytes)
    } catch {
      // Fall back to the document's declared encoding for an unknown label.
    }
  }
  return decodeWebDocument(bytes)
}

function resolveUrl(value: string, base: string, keepFragment = false) {
  try {
    const url = new URL(value, base)
    if (!keepFragment) url.hash = ""
    return url.href
  } catch {
    return value
  }
}

function sourceCandidates(srcset: string) {
  return Array.from(
    srcset.matchAll(/(?:^|,)\s*([^\s,]+)(?:\s+[^,]*)?/g),
    (match) => match[1]!
  )
}

export function convertWebArchive(bytes: Uint8Array, previewLabel: string) {
  const archive = parsePlistDictionary(bytes, { data: "view" })
  const main = resource(archive.WebMainResource)
  if (
    !main?.bytes.length ||
    !["text/html", "application/xhtml+xml"].includes(main.type)
  ) {
    throw new Error("Missing archived HTML page")
  }
  const resources = new Map<string, Resource>()
  const bundled = archive.WebSubresources
  for (const value of Array.isArray(bundled) ? bundled : []) {
    const item = resource(value)
    if (item) resources.set(resolveUrl(item.url, main.url), item)
  }
  const source = decode(main)
  const inert = document.createElement("template").content.ownerDocument
  const page = inert.createElement("html")
  page.innerHTML = source
  const base = resolveUrl(
    page.querySelector("base[href]")?.getAttribute("href") ?? main.url,
    main.url
  )
  const embedded = new Map<string, string>()
  function dataUrl(path: string, from: string) {
    const url = resolveUrl(path, from)
    const existing = embedded.get(url)
    if (existing) return existing
    const item = resources.get(url)
    if (!item || !embeddable.test(item.type)) return null
    const data = `data:${item.type};base64,${encodeBase64(item.bytes)}`
    embedded.set(url, data)
    return data
  }
  function inlineCss(
    css: string,
    from: string,
    context: "stylesheet" | "declarationList",
    ancestors = new Set([from])
  ): string {
    const tree = parse(css, { context })
    walk(tree, {
      visit: "Url",
      enter(node) {
        const data = dataUrl(node.value, from)
        if (data) node.value = data
      },
    })
    if (tree.type !== "StyleSheet") return generate(tree)
    return tree.children
      .toArray()
      .map((rule) => {
        if (
          rule.type !== "Atrule" ||
          rule.name.toLowerCase() !== "import" ||
          rule.prelude?.type !== "AtrulePrelude"
        )
          return generate(rule)
        const [target, media, ...conditions] = rule.prelude.children.toArray()
        if (
          (target?.type !== "String" && target?.type !== "Url") ||
          (media && media.type !== "MediaQueryList") ||
          conditions.length
        )
          return generate(rule)
        const url = resolveUrl(target.value, from)
        const sheet = resources.get(url)
        if (sheet?.type !== "text/css") return generate(rule)
        if (ancestors.has(url)) return ""
        const css = inlineCss(
          decode(sheet),
          url,
          "stylesheet",
          new Set([...ancestors, url])
        )
        return media ? `@media ${generate(media)}{${css}}` : css
      })
      .join("\n")
  }
  for (const style of page.querySelectorAll("style")) {
    const css = style.textContent ?? ""
    style.textContent = inlineCss(css, base, "stylesheet").replace(
      /<\/style/gi,
      "<\\/style"
    )
  }
  for (const link of page.querySelectorAll<HTMLLinkElement>("link[href]")) {
    if (!link.matches('[rel~="stylesheet" i]')) {
      link.remove()
      continue
    }
    const style = resources.get(resolveUrl(link.getAttribute("href")!, base))
    if (style?.type !== "text/css") continue
    const content = inlineCss(
      decode(style),
      resolveUrl(style.url, main.url),
      "stylesheet"
    )
    const element = inert.createElement("style")
    const media = link.getAttribute("media")
    element.textContent = (
      media ? `@media ${media} {${content}}` : content
    ).replace(/<\/style/gi, "<\\/style")
    link.replaceWith(element)
  }
  for (const node of page.querySelectorAll("[style]")) {
    node.setAttribute(
      "style",
      inlineCss(node.getAttribute("style")!, base, "declarationList")
    )
  }
  for (const image of page.querySelectorAll("img")) {
    const src = image.getAttribute("src") ?? ""
    const sources = [
      image,
      ...(image.closest("picture")?.querySelectorAll("source[srcset]") ?? []),
    ]
    const paths = [
      src,
      ...sources.flatMap((node) =>
        sourceCandidates(node.getAttribute("srcset") ?? "")
      ),
    ].filter(Boolean)
    for (const path of paths) {
      const data = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i.test(
        path
      )
        ? path
        : dataUrl(path, base)
      if (!data?.startsWith("data:image/")) continue
      image.setAttribute("src", data)
      image.removeAttribute("srcset")
      break
    }
  }
  for (const link of page.querySelectorAll("a[href]")) {
    const url = link.getAttribute("href")!
    if (!url.startsWith("#"))
      link.setAttribute("href", resolveUrl(url, base, true))
  }
  const nested =
    page.querySelector("iframe,frame") !== null ||
    (Array.isArray(archive.WebSubframeArchives) &&
      archive.WebSubframeArchives.length > 0)
  const opening = source.match(/<html(?=[\s>])[^>]*>/i)?.[0] ?? "<html>"
  const output = prepareWebDocument(opening + page.innerHTML + "</html>", {
    emptyText: previewLabel,
    headingText: previewLabel,
    links: "direct",
  })
  return {
    title: output.title,
    html: output.html,
    missing: nested || output.notes.local || output.notes.remote,
  }
}
