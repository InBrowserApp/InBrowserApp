import { parse, walk } from "css-tree"
import { prepareWebDocument } from "./index"

/** Only already-sanitized, self-contained HTML reaches image decoding. */
export function imageSources(html: string) {
  const inert = document.createElement("template")
  inert.innerHTML = html
  const sources = new Set<string>()
  for (const image of inert.content.querySelectorAll("img")) {
    const src = image.getAttribute("src")
    if (!src) throw new Error("unsupported")
    sources.add(src)
  }
  for (const element of inert.content.querySelectorAll("style,[style]")) {
    const stylesheet = element.localName === "style"
    const tree = parse(
      stylesheet ? element.textContent! : element.getAttribute("style")!,
      { context: stylesheet ? "stylesheet" : "declarationList" }
    )
    walk(tree, (node) => {
      if (node.type === "Url" && /^data:image\//i.test(node.value))
        sources.add(node.value)
    })
  }
  return sources
}

async function verifyImage(src: string, signal: AbortSignal) {
  signal.throwIfAborted()
  if (!/^data:image\/(png|jpeg|gif|webp|avif|bmp);base64,/i.test(src))
    throw new Error("unsupported")
  await new Promise<void>((resolve, reject) => {
    const image = new Image()
    const done = (reason?: unknown) => {
      signal.removeEventListener("abort", abort)
      image.onload = null
      image.onerror = null
      image.removeAttribute("src")
      if (reason !== undefined) reject(reason)
      else resolve()
    }
    const abort = () => done(signal.reason)
    signal.addEventListener("abort", abort, { once: true })
    image.onload = () =>
      done(image.naturalWidth ? undefined : new Error("unsupported"))
    image.onerror = () => done(new Error("unsupported"))
    try {
      image.src = src
    } catch (reason) {
      done(reason)
    }
  })
}

export async function exportWebDocument(
  source: string,
  signal: AbortSignal,
  headingText: string
) {
  signal.throwIfAborted()
  const preview = prepareWebDocument(source, { emptyText: "", headingText })
  if (preview.empty) throw new Error("invalid")
  if (preview.notes.local || preview.notes.remote)
    throw new Error("unsupported")
  for (const src of imageSources(preview.html)) await verifyImage(src, signal)
  signal.throwIfAborted()
  // Direct export links come from the sanitizer's validated hrefs. The preview
  // keeps managed inert links for the parent frame's navigation handlers.
  const exported = prepareWebDocument(source, {
    emptyText: "",
    headingText,
    links: "direct",
  })
  return {
    preview,
    file: new Blob([exported.html], { type: "text/html;charset=utf-8" }),
  }
}
