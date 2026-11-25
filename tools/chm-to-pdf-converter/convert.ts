import { decodeChmText, openChm, sanitizeChmHtmlDocument } from "@workspace/chm"
import type { Topic } from "@workspace/chm"
import { renderPdf } from "@workspace/html-pdf"
import type { Progress } from "@workspace/html-pdf"

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

export async function convert(
  file: File,
  signal: AbortSignal,
  progress: (update: Progress) => void
) {
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

  return renderPdf(
    {
      html,
      css: `
        section + section { margin-top: 1.75em; }
        pre { white-space: pre-wrap; overflow-wrap: anywhere; }
        img { max-height: 220mm; object-fit: contain; break-inside: avoid; }
      `,
      omitUnsupportedElements: true,
    },
    signal,
    progress
  )
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
    "[style], [background], [poster], [id]"
  )) {
    for (const attr of ["style", "background", "poster", "id"])
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
  return body.innerHTML.trim() ? `<section>${body.innerHTML}</section>` : ""
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
