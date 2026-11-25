import { decodeWebDocument, prepareWebDocument } from "@workspace/web-document"
import { isImage, mediaType } from "./archive"
import type { Capture } from "./archive"

function decode(body: Uint8Array, contentType: string) {
  const encoding = /charset\s*=\s*["']?([^\s;"']+)/i.exec(contentType)?.[1]
  if (encoding) {
    try {
      return new TextDecoder(encoding).decode(body)
    } catch {
      // Use the document's encoding when the HTTP label is unrecognized.
    }
  }
  return decodeWebDocument(body)
}

function absoluteUrl(value: string, base?: string) {
  try {
    const url = new URL(value, base || undefined)
    url.hash = ""
    return url.href
  } catch {
    return ""
  }
}

export function indexResources(captures: Capture[]) {
  const resources = new Map<string, Capture[]>()
  for (const capture of captures) {
    if (!capture.body?.length || !capture.url) continue
    const key = absoluteUrl(capture.url)
    if (!key) continue
    const existing = resources.get(key)
    if (existing) existing.push(capture)
    else resources.set(key, [capture])
  }
  return resources
}

function encodeImage(body: Uint8Array) {
  let binary = ""
  for (let offset = 0; offset < body.length; offset += 8192) {
    binary += String.fromCharCode(...body.subarray(offset, offset + 8192))
  }
  return btoa(binary)
}

export function previewCapture(
  capture: Capture & { body: Uint8Array },
  resources: ReturnType<typeof indexResources>,
  label: string
) {
  const inert = document.createElement("template").content.ownerDocument
  const root = inert.createElement("html")
  const source = decode(capture.body, capture.contentType)
  root.innerHTML = source
  const baseAttribute = root.querySelector("base[href]")?.getAttribute("href")
  const base =
    (baseAttribute && absoluteUrl(baseAttribute, capture.url)) || capture.url
  const time = Date.parse(capture.date)
  function resource(path: string, accepts: (contentType: string) => boolean) {
    const captures = resources.get(absoluteUrl(path, base))
    let best: Capture | undefined
    let distance = Infinity
    for (const candidate of captures ?? []) {
      if (!accepts(candidate.contentType)) continue
      const delta = Math.abs(Date.parse(candidate.date) - time)
      if (!best || delta < distance) {
        best = candidate
        distance = Number.isNaN(delta) ? Infinity : delta
      }
    }
    return best
  }
  for (const link of root.querySelectorAll<HTMLLinkElement>("link[href]")) {
    if (!link.matches('[rel~="stylesheet" i]')) {
      link.remove()
      continue
    }
    const css = resource(
      link.getAttribute("href")!,
      (value) => mediaType(value) === "text/css"
    )
    if (!css?.body) continue
    const style = inert.createElement("style")
    const text = decode(css.body, css.contentType)
    const media = link.getAttribute("media")
    style.textContent = (
      media ? `@media ${media} {\n${text}\n}` : text
    ).replace(/<\/style/gi, "<\\/style")
    link.replaceWith(style)
  }
  for (const img of root.querySelectorAll("img[src]")) {
    const image = resource(img.getAttribute("src")!, isImage)
    if (!image?.body) continue
    img.setAttribute(
      "src",
      `data:${mediaType(image.contentType)};base64,${encodeImage(image.body)}`
    )
    img.removeAttribute("srcset")
  }
  // The HTML fragment parser discards outer attributes such as lang and dir.
  const opening = source.match(/<html(?=[\s>])[^>]*>/i)?.[0] ?? "<html>"
  return prepareWebDocument(opening + root.innerHTML + "</html>", {
    emptyText: label,
    headingText: label,
  })
}
