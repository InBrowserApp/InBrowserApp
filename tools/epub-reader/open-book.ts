import { BlobReader, BlobWriter, TextWriter, ZipReader } from "@zip.js/zip.js"
import { EPUB } from "foliate-js/epub.js"
import type { OpenBook } from "./types"

function metadataText(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (Array.isArray(value))
    return value.map(metadataText).filter(Boolean).join(", ")
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    return metadataText(record.name ?? Object.values(record)[0])
  }
  return ""
}

export async function openBook(
  file: File,
  signal: AbortSignal
): Promise<OpenBook> {
  if (!/\.epub$/i.test(file.name) || !file.size) throw new Error("invalid")
  const zip = new ZipReader(new BlobReader(file))
  let engine: EPUB | undefined
  let cover: string | null = null
  try {
    const entries = await zip.getEntries()
    signal.throwIfAborted()
    const files = new Map(
      entries.filter((e) => !e.directory).map((e) => [e.filename, e])
    )
    if (entries.some((e) => e.encrypted)) throw new Error("protected")
    const read = async (path: string) => {
      signal.throwIfAborted()
      const entry = files.get(path)
      return entry?.getData ? entry.getData(new TextWriter(), { signal }) : null
    }
    const encryption = await read("META-INF/encryption.xml")
    if (encryption) {
      const xml = new DOMParser().parseFromString(encryption, "application/xml")
      if (xml.querySelector("parsererror")) throw new Error("invalid")
      for (const method of xml.getElementsByTagNameNS(
        "*",
        "EncryptionMethod"
      )) {
        if (
          ![
            "http://www.idpf.org/2008/embedding",
            "http://ns.adobe.com/pdf/enc#RC",
          ].includes(method.getAttribute("Algorithm") ?? "")
        )
          throw new Error("protected")
      }
    }
    const container = await read("META-INF/container.xml")
    if (container) {
      const xml = new DOMParser().parseFromString(container, "application/xml")
      const packagePath = Array.from(
        xml.getElementsByTagNameNS("*", "rootfile")
      )
        .find(
          (entry) =>
            entry.getAttribute("media-type") === "application/oebps-package+xml"
        )
        ?.getAttribute("full-path")
      const source = packagePath ? await read(packagePath) : null
      if (source) {
        const packageDocument = new DOMParser().parseFromString(
          source,
          "application/xml"
        )
        const spine = packageDocument.getElementsByTagNameNS("*", "spine")[0]
        // Foliate builds CFIs from the first itemref before exposing sections.
        if (spine && !spine.getElementsByTagNameNS("*", "itemref").length)
          throw new Error("empty")
      }
    }
    engine = new EPUB({
      loadText: read,
      loadBlob: async (path) => {
        signal.throwIfAborted()
        const entry = files.get(path)
        return entry?.getData
          ? entry.getData(new BlobWriter(), { signal })
          : null
      },
      getSize: (path) => files.get(path)?.uncompressedSize ?? 0,
    })
    const parsed = await engine.init()
    signal.throwIfAborted()
    if (
      parsed.rendition.layout === "pre-paginated" ||
      parsed.resources.spine.some((entry) =>
        entry.properties?.includes("rendition:layout-pre-paginated")
      )
    )
      throw new Error("unsupportedLayout")
    if (!parsed.sections.length) throw new Error("empty")
    // Foliate's resolver indexes the original spine, which may have gaps.
    // Resolve against the chapters that are actually available in this book.
    parsed.resolveHref = (href) => {
      try {
        const [path, ...fragment] = href.split("#")
        const index = parsed.sections.findIndex(
          (section) => section.id === decodeURI(path!)
        )
        if (index < 0) return null
        const id = decodeURIComponent(fragment.join("#"))
        return {
          index,
          anchor: (doc) =>
            id
              ? doc.getElementById(id) ||
                Array.from(doc.getElementsByName(id))[0] ||
                null
              : 0,
        }
      } catch {
        return null
      }
    }
    let coverMissing = false
    if (parsed.resources.cover?.href) {
      try {
        if (!files.has(parsed.resources.cover.href)) throw new Error("cover")
        const image = await parsed.getCover()
        if (image?.size) cover = URL.createObjectURL(image)
      } catch {
        // The cover is optional; a damaged image must not hide readable text.
        coverMissing = true
      }
    }
    signal.throwIfAborted()
    return {
      parsed,
      title: metadataText(parsed.metadata.title) || file.name,
      author: metadataText(parsed.metadata.author),
      cover,
      missing:
        coverMissing ||
        parsed.resources.spine.length !== parsed.sections.length ||
        parsed.resources.manifest.some((entry) => !files.has(entry.href)),
      dispose() {
        parsed.destroy()
        if (cover) URL.revokeObjectURL(cover)
        void zip.close()
      },
    }
  } catch (error) {
    engine?.destroy()
    if (cover) URL.revokeObjectURL(cover)
    await zip.close()
    throw error
  }
}
