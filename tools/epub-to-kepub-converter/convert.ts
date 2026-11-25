import {
  BlobReader,
  BlobWriter,
  TextReader,
  Uint8ArrayWriter,
  ZipReader,
  ZipWriter,
  type CreateReadableOptions,
  type FileEntry,
} from "@zip.js/zip.js"
import { addKoboMarkup, parseXml } from "./kobo-markup"
import { KepubError, type Progress } from "./types"

const epubMime = "application/epub+zip"
const packageMime = "application/oebps-package+xml"
const xhtmlMime = "application/xhtml+xml"
const dc = "http://purl.org/dc/elements/1.1/"
const fontObfuscation = new Set([
  "http://www.idpf.org/2008/embedding",
  "http://ns.adobe.com/pdf/enc#RC",
])

async function readXml(
  file: FileEntry,
  signal: AbortSignal,
  code: "damaged" | "incomplete" = "damaged"
) {
  const bytes = await file.getData(new Uint8ArrayWriter(), {
    signal,
    checkSignature: true,
  })
  const encoding =
    (bytes[0] === 0xff && bytes[1] === 0xfe) ||
    (bytes[0] === 0x3c && bytes[1] === 0)
      ? "utf-16le"
      : (bytes[0] === 0xfe && bytes[1] === 0xff) ||
          (bytes[0] === 0 && bytes[1] === 0x3c)
        ? "utf-16be"
        : "utf-8"
  return parseXml(new TextDecoder(encoding).decode(bytes), code)
}

function resourcePath(from: string, href: string | null) {
  if (!href) return null
  const base = new URL(
    "https://epub.invalid/" + from.split("/").map(encodeURIComponent).join("/")
  )
  try {
    const target = new URL(href, base)
    return target.origin === base.origin
      ? decodeURIComponent(target.pathname.slice(1))
      : null
  } catch {
    return null
  }
}

function properties(element: Element): string[] {
  return (element.getAttribute("properties") ?? "").match(/\S+/g) ?? []
}

function getPublication(
  doc: Document,
  path: string,
  entries: Map<string, FileEntry>
) {
  const root = doc.documentElement
  const ns = root.namespaceURI
  const manifest = doc.getElementsByTagNameNS(ns, "manifest")[0]
  const spine = doc.getElementsByTagNameNS(ns, "spine")[0]
  const metadata = doc.getElementsByTagNameNS(ns, "metadata")[0]
  const version = root.getAttribute("version") ?? ""
  if (
    root.localName !== "package" ||
    !manifest ||
    !spine ||
    !metadata ||
    !/^[23]\./.test(version)
  )
    throw new KepubError("damaged")

  const metas = Array.from(metadata.getElementsByTagNameNS(ns, "meta"))
  const itemRefs = Array.from(spine.getElementsByTagNameNS(ns, "itemref"))
  if (
    metas.some(
      (meta) =>
        (meta.getAttribute("property") === "rendition:layout" &&
          meta.textContent?.trim() === "pre-paginated") ||
        (meta.getAttribute("name") === "fixed-layout" &&
          meta.getAttribute("content") === "true")
    ) ||
    itemRefs.some((itemRef) =>
      properties(itemRef).includes("rendition:layout-pre-paginated")
    )
  )
    throw new KepubError("unsupportedLayout")

  const items = Array.from(manifest.getElementsByTagNameNS(ns, "item"))
  const ids = new Map(items.map((item) => [item.id, item]))
  const spineIds = new Set(
    itemRefs.map((item) => item.getAttribute("idref") ?? "")
  )
  if (!spineIds.size || [...spineIds].some((id) => !ids.has(id)))
    throw new KepubError("incomplete")

  const chapters = new Map<string, FileEntry>()
  for (const item of items) {
    if (item.getAttribute("media-type") !== xhtmlMime) continue
    const href = resourcePath(path, item.getAttribute("href"))
    const file = href && entries.get(href)
    if (!file) throw new KepubError("incomplete")
    if (properties(item).includes("nav") && !spineIds.has(item.id)) continue
    chapters.set(file.filename, file)
  }
  if (!chapters.size) throw new KepubError("incomplete")

  // Use the Kobo cover designation when the publisher supplied a legacy cover ID.
  const epub3 = version.startsWith("3.")
  let coverChanged = false
  if (
    epub3 &&
    !items.some((item) => properties(item).includes("cover-image"))
  ) {
    const namedCover = metas.find(
      (meta) => meta.getAttribute("name") === "cover"
    )
    const cover = ids.get(namedCover?.getAttribute("content") ?? "cover")
    if (cover?.getAttribute("media-type")?.startsWith("image/")) {
      cover.setAttribute(
        "properties",
        [...properties(cover), "cover-image"].join(" ")
      )
      coverChanged = true
    }
  }
  const title = metadata
    .getElementsByTagNameNS(dc, "title")[0]
    ?.textContent?.trim()
  return { title, chapters, coverChanged, epub3 }
}

export async function convertEpub(
  source: File,
  signal: AbortSignal,
  onProgress: (progress: Progress) => void
) {
  signal.throwIfAborted()
  const reader = new (class extends BlobReader {
    override createReadable(options?: CreateReadableOptions) {
      // Stop the raw ZIP copy as well as the chapter reads on cancellation.
      return super
        .createReadable(options)
        .pipeThrough(new TransformStream<Uint8Array, Uint8Array>(), { signal })
    }
  })(source)
  const archive = new ZipReader(reader)
  const output = new ZipWriter(new BlobWriter(epubMime), {
    dataDescriptor: false,
    extendedTimestamp: false,
  })
  try {
    const entries = new Map<string, FileEntry>()
    for (const file of await archive.getEntries()) {
      if (file.encrypted) throw new KepubError("protected")
      if (file.directory) continue
      if (entries.has(file.filename)) throw new KepubError("damaged")
      entries.set(file.filename, file)
    }

    const encryption = entries.get("META-INF/encryption.xml")
    if (encryption) {
      const doc = await readXml(encryption, signal)
      const methods = Array.from(
        doc.getElementsByTagNameNS("*", "EncryptionMethod")
      )
      if (
        methods.some(
          (method) =>
            !fontObfuscation.has(method.getAttribute("Algorithm") ?? "")
        )
      )
        throw new KepubError("protected")
    }

    const container = entries.get("META-INF/container.xml")
    if (!container) throw new KepubError("damaged")
    const containerDoc = await readXml(container, signal)
    const rootFile = Array.from(
      containerDoc.getElementsByTagNameNS("*", "rootfile")
    ).find((entry) => entry.getAttribute("media-type") === packageMime)
    const path = resourcePath("", rootFile?.getAttribute("full-path") ?? null)
    const packageFile = path && entries.get(path)
    if (!packageFile) throw new KepubError("damaged")
    const packageDoc = await readXml(packageFile, signal)
    const { title, chapters, coverChanged, epub3 } = getPublication(
      packageDoc,
      packageFile.filename,
      entries
    )

    const add = (path: string, text: string, level?: number) =>
      output.add(path, new TextReader(text), { signal, level })
    await add("mimetype", epubMime, 0)
    const serializer = new XMLSerializer()
    const serialize = (doc: Document) =>
      serializer
        .serializeToString(doc)
        .replace(/^<\?xml\s[^?]*\?>/, (declaration) =>
          declaration.replace(
            /\bencoding\s*=\s*["'][^"']+["']/,
            'encoding="UTF-8"'
          )
        )
    let current = 0
    for (const [path, chapter] of chapters) {
      signal.throwIfAborted()
      onProgress({ current: ++current, total: chapters.size })
      const doc = await readXml(chapter, signal, "incomplete")
      addKoboMarkup(doc, epub3)
      await add(path, serialize(doc))
    }
    if (coverChanged) await add(packageFile.filename, serialize(packageDoc))

    onProgress("saving")
    await output.appendZip(reader, {
      filter: ({ filename, directory }) => {
        signal.throwIfAborted()
        return (
          !directory &&
          filename !== "mimetype" &&
          !chapters.has(filename) &&
          !(coverChanged && filename === packageFile.filename)
        )
      },
    })
    const file = await output.close()
    signal.throwIfAborted()
    return { file, title }
  } catch (error) {
    await output.close().catch(() => {})
    throw error
  } finally {
    await archive.close()
  }
}
