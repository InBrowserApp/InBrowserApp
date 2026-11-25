import { BlobReader, BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js"
import { packageDocument } from "./package"
import type { PublicationItem, PublicationMetadata } from "./package"

const mime = "application/epub+zip"
const container =
  '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'

type AddResource = (
  href: string,
  source: string | Blob,
  item: Omit<PublicationItem, "href">
) => Promise<void>

export async function writePublication(
  book: PublicationMetadata,
  language: string,
  signal: AbortSignal,
  write: (add: AddResource) => Promise<void>,
  fixedLayout = false
) {
  signal.throwIfAborted()
  const zip = new ZipWriter(new BlobWriter(mime), {
    signal,
    extendedTimestamp: false,
    dataDescriptor: false,
  })
  const items: PublicationItem[] = []
  try {
    await zip.add("mimetype", new TextReader(mime), { level: 0 })
    await zip.add("META-INF/container.xml", new TextReader(container))
    await write(async (href, source, item) => {
      signal.throwIfAborted()
      await zip.add(
        "EPUB/" + href,
        typeof source === "string"
          ? new TextReader(source)
          : new BlobReader(source),
        fixedLayout && typeof source !== "string" ? { level: 0 } : {}
      )
      items.push({ ...item, href })
    })
    await zip.add(
      "EPUB/package.opf",
      new TextReader(packageDocument(book, language, items, fixedLayout))
    )
    signal.throwIfAborted()
    const epub = await zip.close()
    signal.throwIfAborted()
    return epub
  } catch (error) {
    await zip.close().catch(() => {})
    signal.throwIfAborted()
    throw error
  }
}
