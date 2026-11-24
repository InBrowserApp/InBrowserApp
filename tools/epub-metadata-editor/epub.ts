import {
  BlobReader,
  BlobWriter,
  TextReader,
  Uint8ArrayWriter,
  ZipReader,
  ZipWriter,
  type FileEntry,
} from "@zip.js/zip.js"
import { packageDocument, parseXml } from "./package-document"
import type { BookDetails, EpubBook } from "./types"

const epubMime = "application/epub+zip"
const packageMime = "application/oebps-package+xml"
const fontObfuscation = new Set([
  "http://www.idpf.org/2008/embedding",
  "http://ns.adobe.com/pdf/enc#RC",
])

function resourcePath(documentPath: string, href: string | null | undefined) {
  if (!href) return null
  const file = documentPath.split("/").map(encodeURIComponent).join("/")
  const base = new URL("https://epub.invalid/" + file)
  try {
    const target = new URL(href, base)
    return target.origin === base.origin
      ? decodeURIComponent(target.pathname.slice(1))
      : null
  } catch {
    return null
  }
}

async function readXml(entry: FileEntry | undefined) {
  if (!entry) return null
  const bytes = await entry.getData(new Uint8ArrayWriter())
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  return new TextDecoder(encoding).decode(bytes)
}

type Publication = ReturnType<typeof packageDocument>

async function findCover(
  path: string,
  files: Map<string, FileEntry>,
  { coverItem, guideCover, items }: Publication
) {
  function imageInfo(item: Element | undefined) {
    const image = resourcePath(path, item?.getAttribute("href"))
    const type = item?.getAttribute("media-type")
    return item && image && type?.startsWith("image/") && files.has(image)
      ? { item, image, type }
      : null
  }
  const declared = imageInfo(coverItem)
  if (declared) return declared

  const guidePath = resourcePath(path, guideCover)
  if (!guidePath) return null
  const images = items.map(imageInfo).filter((image) => image !== null)
  const direct = images.find(({ image }) => image === guidePath)
  if (direct) return direct

  // Some EPUB 2 packages identify only a cover page in the guide.
  try {
    const source = await readXml(files.get(guidePath))
    if (!source) return null
    const page = parseXml(source)
    const paths = new Set(
      Array.from(page.querySelectorAll("img[src], image"), (element) =>
        resourcePath(
          guidePath,
          element.getAttribute("src") ??
            element.getAttribute("href") ??
            element.getAttributeNS("http://www.w3.org/1999/xlink", "href")
        )
      )
    )
    const matches = images.filter(({ image }) => paths.has(image))
    return matches.length === 1 ? matches[0]! : null
  } catch {
    return null
  }
}

async function readPackage(zip: ZipReader<Blob>) {
  const entries = await zip.getEntries()
  if (entries.some((entry) => entry.encrypted)) throw new Error("protected")
  const files = new Map<string, FileEntry>()
  for (const entry of entries) {
    if (entry.directory) continue
    if (files.has(entry.filename)) throw new Error("invalid")
    files.set(entry.filename, entry)
  }

  const encryption = await readXml(files.get("META-INF/encryption.xml"))
  if (encryption) {
    const methods = parseXml(encryption).getElementsByTagNameNS(
      "*",
      "EncryptionMethod"
    )
    if (
      Array.from(methods).some(
        (method) => !fontObfuscation.has(method.getAttribute("Algorithm") ?? "")
      )
    )
      throw new Error("protected")
  }
  const container = await readXml(files.get("META-INF/container.xml"))
  if (!container) throw new Error("invalid")
  const roots = parseXml(container).getElementsByTagNameNS("*", "rootfile")
  const fullPath = Array.from(roots)
    .find((root) => root.getAttribute("media-type") === packageMime)
    ?.getAttribute("full-path")
  const decoded = resourcePath("", fullPath)
  const path = decoded && files.has(decoded) ? decoded : fullPath
  const source = path && (await readXml(files.get(path)))
  if (!path || !source) throw new Error("invalid")

  const publication = packageDocument(source)
  const cover = await findCover(path, files, publication)
  return { path, files, publication, cover }
}

async function withPackage<T>(
  source: Blob,
  run: (data: Awaited<ReturnType<typeof readPackage>>) => Promise<T>
) {
  const zip = new ZipReader(new BlobReader(source))
  try {
    return await run(await readPackage(zip))
  } finally {
    await zip.close()
  }
}

export async function openEpub(source: Blob): Promise<EpubBook> {
  return withPackage(source, async ({ publication, files, cover }) => {
    let preview: Blob | null = null
    if (cover) {
      try {
        preview = await files
          .get(cover.image)!
          .getData(new BlobWriter(cover.type))
      } catch {
        // Metadata is still editable when the old cover cannot be read.
      }
    }
    return {
      details: publication.details(),
      cover: preview,
      coverType: cover?.type ?? null,
    }
  })
}

export async function saveEpub(
  source: Blob,
  details: BookDetails,
  replacement: Blob | null
) {
  return withPackage(source, async ({ path, files, publication, cover }) => {
    publication.updateDetails(details)
    let replacementPath: string | null = null
    if (replacement) {
      if (cover?.type === replacement.type) {
        replacementPath = cover.image
        publication.setCover("", replacement.type, cover.item)
      } else {
        const folder = path.slice(0, path.lastIndexOf("/") + 1)
        const extension = replacement.type === "image/png" ? "png" : "jpg"
        let href = "cover-image." + extension
        for (let i = 2; files.has(folder + href); i++)
          href = "cover-image-" + i + "." + extension
        replacementPath = folder + href
        publication.setCover(href, replacement.type)
      }
    }

    const zip = new ZipWriter(new BlobWriter(epubMime), {
      dataDescriptor: false,
      extendedTimestamp: false,
    })
    try {
      await zip.add("mimetype", new TextReader(epubMime), { level: 0 })
      await zip.appendZip(new BlobReader(source), {
        filter: ({ filename }) =>
          filename !== "mimetype" &&
          filename !== path &&
          filename !== replacementPath,
      })
      await zip.add(path, new TextReader(publication.serialize()))
      if (replacementPath && replacement)
        await zip.add(replacementPath, new BlobReader(replacement))
      return await zip.close()
    } catch (error) {
      await zip.close().catch(() => {})
      throw error
    }
  })
}
