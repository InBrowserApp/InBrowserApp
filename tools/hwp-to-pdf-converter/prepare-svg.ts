import { sanitizePage } from "@workspace/hwp/sanitize"
import { cjkFamily, fontFamily } from "./font-family"
import { checkRaster } from "./raster-mime"
import type { Resource } from "./core/resources"

async function decode(blob: Blob, signal: AbortSignal, png = false) {
  signal.throwIfAborted()
  const image = new Image()
  const url = URL.createObjectURL(blob)
  let abort = () => {}
  try {
    image.src = url
    await Promise.race([
      image.decode(),
      new Promise<never>((_, reject) => {
        abort = () => reject(signal.reason)
        signal.addEventListener("abort", abort, { once: true })
      }),
    ])
    signal.throwIfAborted()
    if (!image.naturalWidth || !image.naturalHeight)
      throw new Error("unsupported")
    if (!png) return ""
    const canvas = document.createElement("canvas")
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext("2d")
    if (!context) throw new Error("browserUnsupported")
    try {
      context.drawImage(image, 0, 0)
      const result = canvas.toDataURL("image/png")
      if (!result.startsWith("data:image/png;base64,"))
        throw new Error("resource")
      return result
    } finally {
      canvas.width = canvas.height = 0
    }
  } catch (cause) {
    signal.throwIfAborted()
    if (
      cause instanceof Error &&
      ["resource", "browserUnsupported"].includes(cause.message)
    )
      throw cause
    throw new Error("unsupported", { cause })
  } finally {
    signal.removeEventListener("abort", abort)
    image.removeAttribute("src")
    URL.revokeObjectURL(url)
  }
}

async function normalizeSvg(source: string, signal: AbortSignal, page = false) {
  signal.throwIfAborted()
  const clean = sanitizePage(source)
  if (clean.limited) throw new Error("unsupported")
  const parser = new DOMParser()
  const pending: { node: Element; reference?: Attr }[] = [
    {
      node: parser.parseFromString(clean.svg, "image/svg+xml").documentElement,
    },
  ]
  for (let index = 0; index < pending.length; index++) {
    const node = pending[index]!.node
    const vectorPage = page && index === 0
    for (const element of [node, ...node.querySelectorAll("*")]) {
      const family = element.getAttribute("font-family")
      const cjk =
        vectorPage &&
        (element.localName === "text" || element.localName === "tspan") &&
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(
          element.textContent ?? ""
        )
      if (cjk) element.setAttribute("font-family", cjkFamily)
      else if (family) element.setAttribute("font-family", fontFamily(family))
      const style = element.getAttribute("style")
      // The PDF renderer does not apply SVG filters. Embedded illustrations
      // are decoded by the browser and can still use them.
      if (
        vectorPage &&
        (element.hasAttribute("filter") ||
          /(?:^|;)\s*filter\s*:/i.test(style ?? ""))
      )
        throw new Error("unsupported")
      if (style)
        element.setAttribute(
          "style",
          style.replace(
            /font-family\s*:\s*([^;]+)/gi,
            (_, value: string) =>
              `font-family:${cjk ? cjkFamily : fontFamily(value)}`
          )
        )
      if (element.localName !== "image") continue
      const references = Array.from(element.attributes).filter(
        (item) => item.localName === "href"
      )
      const attr = references[0]
      if (references.some((item) => item.value !== attr!.value))
        throw new Error("unsupported")
      for (const duplicate of references.slice(1))
        element.removeAttributeNode(duplicate)
      if (!attr || attr.value.startsWith("#")) throw new Error("unsupported")
      const nested = "data:image/svg+xml;charset=utf-8,"
      if (attr.value.startsWith(nested)) {
        pending.push({
          node: parser.parseFromString(
            decodeURIComponent(attr.value.slice(nested.length)),
            "image/svg+xml"
          ).documentElement,
          reference: attr,
        })
      } else {
        const match = /^data:(image\/[a-z]+);base64,([a-z\d+/=\s]+)$/i.exec(
          attr.value
        )
        if (!match) throw new Error("unsupported")
        const bytes = Uint8Array.from(atob(match[2]!), (char) =>
          char.charCodeAt(0)
        )
        checkRaster(bytes, match[1]!)
        attr.value = await decode(
          new Blob([bytes], { type: match[1] }),
          signal,
          true
        )
      }
    }
  }
  const serializer = new XMLSerializer()
  for (let index = pending.length - 1; index > 0; index--) {
    const { node, reference } = pending[index]!
    reference!.value = await decode(
      new Blob([serializer.serializeToString(node)], { type: "image/svg+xml" }),
      signal,
      true
    )
  }
  return serializer.serializeToString(pending[0]!.node)
}

export function prepareSvg(source: string, signal: AbortSignal) {
  return normalizeSvg(source, signal, true)
}

export async function validateResources(
  resources: Resource[],
  signal: AbortSignal
) {
  for (const item of resources) {
    signal.throwIfAborted()
    let blob: Blob
    if (item.mime === "image/svg+xml") {
      const svg = await normalizeSvg(
        new TextDecoder("utf-8", { fatal: true }).decode(item.bytes),
        signal
      )
      blob = new Blob([svg], { type: item.mime })
    } else {
      checkRaster(item.bytes, item.mime)
      blob = new Blob([new Uint8Array(item.bytes)], { type: item.mime })
    }
    await decode(blob, signal)
  }
}
