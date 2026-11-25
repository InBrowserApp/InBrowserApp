import { decodeChmText, openChm, sanitizeChmHtmlDocument } from "@workspace/chm"
import type { Topic } from "@workspace/chm"
import { prepareWebDocument } from "@workspace/web-document"

type Archive = NonNullable<Awaited<ReturnType<typeof openChm>>>
const rasterTypes: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

const printStyles = `
  @page { size: A4; margin: 18mm; }
  html { color-scheme: light; }
  body { color: #171717; background: #fff; font: 11pt/1.45 serif; overflow-wrap: anywhere; }
  @media screen {
    body { max-width: 50rem; margin: 0 auto; padding: 24px; }
  }
  @media print { body { margin: 0; } }
  section + section { margin-block-start: 1.75em; }
  h1, h2, h3, h4, h5, h6 { break-after: avoid; }
  p { orphans: 2; widows: 2; }
  pre, code, nobr { white-space: pre-wrap; overflow-wrap: anywhere; }
  table { max-width: 100%; width: 100%; table-layout: fixed; }
  th, td { overflow-wrap: anywhere; }
  img { max-width: 100%; height: auto; max-height: 215mm;
    object-fit: contain; break-inside: avoid; }
`

export async function prepareDocument(file: File, signal: AbortSignal) {
  const archive = await openChm(file, signal)
  if (!archive) throw new Error("No CHM topics")

  let html: string
  try {
    const paths = new Set<string>()
    function collect(topics: Topic[]) {
      for (const { destination, children } of topics) {
        if (destination) paths.add(destination.path)
        collect(children)
      }
    }
    collect(archive.contents)
    collect(archive.topics)

    const images = new Map<string, Promise<string>>()
    const sections = []
    for (const path of paths)
      sections.push(await readTopic(archive, path, signal, images))
    html = sections.join("")
  } finally {
    archive.close()
  }

  signal.throwIfAborted()
  const title = document.createElement("title")
  title.textContent = file.name.replace(/\.chm$/i, "")
  const preview = prepareWebDocument(title.outerHTML + html, {
    emptyText: "",
    headingText: "",
    print: true,
    styles: printStyles,
  })
  if (preview.empty) throw new Error("No readable CHM topics")
  return preview.html
}

async function readTopic(
  archive: Archive,
  path: string,
  signal: AbortSignal,
  images: Map<string, Promise<string>>
) {
  const source = decodeChmText(
    await archive.read(path, signal),
    archive.encoding
  )
  signal.throwIfAborted()
  const { document } = sanitizeChmHtmlDocument(source, path, false)
  const body = document.body
  // Keep the static text and embedded raster images. Each topic has its own
  // CSS and anchors, which do not apply to the combined print document.
  for (const element of body.querySelectorAll(
    "audio, video, picture > source, svg, math, style"
  ))
    element.remove()
  for (const element of body.querySelectorAll(
    "[style], [background], [poster], [id], a[name], img[loading]"
  )) {
    for (const attr of [
      "style",
      "background",
      "poster",
      "id",
      "name",
      "loading",
    ])
      element.removeAttribute(attr)
  }
  for (const image of body.querySelectorAll("img")) {
    const reference = image.getAttribute("data-chm-resource-src")
    const entry = reference ? archive.lookup(reference) : undefined
    const extension = entry?.split(".").at(-1)?.toLowerCase() ?? ""
    if (/^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i.test(image.src))
      continue
    if (entry && Object.hasOwn(rasterTypes, extension)) {
      let url = images.get(entry)
      if (!url) {
        url = imageDataUrl(archive, entry, rasterTypes[extension]!, signal)
        images.set(entry, url)
      }
      image.src = await url
    } else {
      image.replaceWith(document.createTextNode(image.alt))
    }
  }
  if (!body.hasChildNodes()) return ""
  const section = document.createElement("section")
  section.dir = body.dir || document.documentElement.dir || "auto"
  section.lang = body.lang || document.documentElement.lang
  section.append(...body.childNodes)
  return section.outerHTML
}

async function imageDataUrl(
  archive: Archive,
  entry: string,
  type: string,
  signal: AbortSignal
): Promise<string> {
  const bytes = await archive.read(entry, signal)
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(new Blob([new Uint8Array(bytes)], { type }))
  })
}
