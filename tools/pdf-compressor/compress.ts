import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
} from "pdf-lib"

import type { PDFObject } from "pdf-lib"

import { reencodeImage } from "./image-codec"
import { presets } from "./protocol"
import type { CompressionLevel, CompressionResult } from "./protocol"

const name = PDFName.of
const imageKeys = new Set(
  [
    "Type",
    "Subtype",
    "Width",
    "Height",
    "ColorSpace",
    "BitsPerComponent",
    "Filter",
    "Length",
    "Interpolate",
  ].map(name)
)
const maxJpegPixels = 40_000_000
const maxFlatePixels = 24_000_000

export async function compressPdf(
  file: File,
  level: CompressionLevel
): Promise<CompressionResult> {
  const bytes = await file.arrayBuffer()
  let pdf: PDFDocument
  try {
    pdf = await PDFDocument.load(bytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: true,
      updateMetadata: false,
    })
    if (pdf.isEncrypted) return { status: "encryptedPdf" }
    if (!pdf.getPageCount()) return { status: "invalidPdf" }
  } catch {
    return { status: "invalidPdf" }
  }

  const objects = pdf.context.enumerateIndirectObjects()
  const { signed, masks, customGray } = inspectDocument(
    objects.map(([, object]) => object)
  )
  if (signed) return { status: "signed" }
  // The serializer cannot write overlapping xref entries for reused object IDs.
  if (
    new Set(objects.map(([ref]) => ref.objectNumber)).size !== objects.length ||
    mustKeepOriginal(pdf) ||
    hasMultipleRevisions(new Uint8Array(bytes))
  )
    return { status: "noSavings" }

  let changed = false
  for (const [ref, object] of objects) {
    if (!(object instanceof PDFRawStream) || masks.has(ref)) continue
    const replacement = await compressImage(object, level, customGray)
    if (replacement) {
      pdf.context.assign(ref, replacement)
      changed = true
    }
  }
  if (!changed) return { status: "noSavings" }

  const output = await pdf.save({
    addDefaultPage: false,
    updateFieldAppearances: false,
  })
  if (output.byteLength >= bytes.byteLength) return { status: "noSavings" }
  return {
    status: "compressed",
    blob: new Blob([new Uint8Array(output)], { type: "application/pdf" }),
  }
}

function hasMultipleRevisions(bytes: Uint8Array) {
  // pdf-lib can reload freed objects from old revisions when rewriting a file.
  // A linearized PDF's front placeholder has an offset of zero.
  const footer = /^startxref\s+([0-9]+)\s+%%EOF(?=\s|$)/
  const decoder = new TextDecoder()
  let foundRevision = false
  let index = bytes.indexOf(115)
  while (index !== -1) {
    if (bytes[index + 1] === 116 && bytes[index + 2] === 97) {
      const match = footer.exec(
        decoder.decode(bytes.subarray(index, index + 64)).replaceAll("\0", " ")
      )
      const offset = Number(match?.[1])
      if (offset > 0 && offset < index) {
        if (foundRevision) return true
        foundRevision = true
      }
    }
    index = bytes.indexOf(115, index + 1)
  }
  return false
}

function mustKeepOriginal(pdf: PDFDocument) {
  // pdf-lib writes PDF 1.7. Preserve PDF 2.x and archival conformance.
  const version = pdf.catalog.lookup(name("Version"))
  if (
    pdf.context.header.toString().startsWith("%PDF-2.") ||
    (version instanceof PDFName && version.decodeText().startsWith("2."))
  )
    return true

  const metadata = pdf.catalog.lookup(name("Metadata"))
  if (!(metadata instanceof PDFRawStream)) return false
  const xml = new TextDecoder()
    .decode(metadata.getContents())
    .replaceAll("\0", "")
  const namespaces = xml.matchAll(
    /\bxmlns(?::[\w.-]+)?\s*=\s*(["'])([^"']+)\1/g
  )
  for (const [, , namespace] of namespaces) {
    if (namespace === "http://www.aiim.org/pdfa/ns/id/") return true
  }
  return false
}

function inspectDocument(objects: PDFObject[]) {
  const masks = new Set<PDFRef>()
  let customGray = false
  for (let index = 0; index < objects.length; index++) {
    const object = objects[index]
    const dict = object instanceof PDFRawStream ? object.dict : object
    if (dict instanceof PDFArray) {
      for (const child of dict.asArray()) objects.push(child)
    }
    if (!(dict instanceof PDFDict)) continue
    if (dict.has(name("ByteRange")) && dict.has(name("Contents"))) {
      return { signed: true, masks, customGray }
    }
    // Replacing gray pixels with RGB must not bypass a default color profile.
    customGray ||= dict.has(name("DefaultGray")) || dict.has(name("DefaultRGB"))
    for (const [key, value] of dict.entries()) {
      if (
        (key === name("SMask") || key === name("Mask")) &&
        value instanceof PDFRef
      ) {
        masks.add(value)
      }
      // Indirect references are already in the top-level list.
      if (value instanceof PDFDict || value instanceof PDFArray)
        objects.push(value)
    }
  }
  return { signed: false, masks, customGray }
}

function imageNumber(dict: PDFDict, key: string) {
  const value = dict.lookup(name(key))
  return value instanceof PDFNumber ? value.asNumber() : 0
}

async function compressImage(
  stream: PDFRawStream,
  level: CompressionLevel,
  customGray: boolean
) {
  const { dict } = stream
  if (dict.get(name("Subtype")) !== name("Image")) return
  // Unknown image entries may change how samples are interpreted. Work only
  // with ordinary opaque RGB and grayscale streams.
  if (dict.keys().some((key) => !imageKeys.has(key))) return
  if (imageNumber(dict, "BitsPerComponent") !== 8) return
  const color = dict.get(name("ColorSpace"))
  if (color !== name("DeviceRGB") && color !== name("DeviceGray")) return
  if (color === name("DeviceGray") && customGray) return
  const filter = dict.get(name("Filter"))
  if (filter !== name("DCTDecode") && filter !== name("FlateDecode")) return

  const width = imageNumber(dict, "Width")
  const height = imageNumber(dict, "Height")
  if (
    !width ||
    !height ||
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width < 0 ||
    height < 0 ||
    width * height >
      (filter === name("DCTDecode") ? maxJpegPixels : maxFlatePixels)
  )
    return

  const jpeg = await reencodeImage(
    stream.getContents(),
    filter === name("DCTDecode") ? "jpeg" : "deflate",
    width,
    height,
    color === name("DeviceGray") ? 1 : 3,
    presets[level]
  )
  if (!jpeg || jpeg.bytes.byteLength >= stream.getContentsSize()) return

  const replacement = dict.clone()
  replacement.set(name("Filter"), name("DCTDecode"))
  replacement.set(name("ColorSpace"), name("DeviceRGB"))
  replacement.set(name("Width"), PDFNumber.of(jpeg.width))
  replacement.set(name("Height"), PDFNumber.of(jpeg.height))
  return PDFRawStream.of(replacement, jpeg.bytes)
}
