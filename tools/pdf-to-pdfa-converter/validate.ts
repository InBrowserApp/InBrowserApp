import {
  JpegEmbedder,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFString,
} from "pdf-lib"

import {
  identification,
  maxPageSize,
  maxPdfa1Pages,
  minPageSize,
  pageDrawing,
  type Profile,
} from "./archive"
import { srgbProfile } from "./srgb"

const name = PDFName.of

function hasKeys(dict: PDFDict, ...keys: string[]) {
  return (
    dict.keys().length === keys.length &&
    keys.every((key) => dict.has(name(key)))
  )
}

function rawStream(dict: PDFDict, key: string) {
  const value = dict.lookup(name(key))
  if (!(value instanceof PDFRawStream)) {
    throw new Error(`Expected a PDF stream for ${key}`)
  }
  return value
}

// The verifier accepts the image-only subset emitted here. It checks the
// serialized objects and JPEG headers, not just the claimed PDF/A profile.
export async function validateArchive(
  bytes: Uint8Array,
  profile: Profile,
  expectedPages: number
) {
  try {
    const pdf = await PDFDocument.load(bytes, {
      updateMetadata: false,
      throwOnInvalidObject: true,
    })
    const { context, catalog } = pdf
    const pages = pdf.getPages()
    const ids = context.trailerInfo.ID
    if (
      (profile === 1 ? "%PDF-1.4" : "%PDF-1.7") !==
        new TextDecoder().decode(bytes.subarray(0, 8)) ||
      pdf.isEncrypted ||
      context.trailerInfo.Info ||
      !(ids instanceof PDFArray) ||
      ids.size() !== 2 ||
      !ids
        .asArray()
        .every(
          (id) => id instanceof PDFHexString && id.asBytes().length === 16
        ) ||
      !pages.length ||
      pages.length !== expectedPages ||
      (profile === 1 && pages.length > maxPdfa1Pages) ||
      context.enumerateIndirectObjects().length !== 4 + pages.length * 3 ||
      !hasKeys(catalog, "Type", "Pages", "Metadata", "OutputIntents")
    ) {
      return false
    }

    const metadata = rawStream(catalog, "Metadata")
    if (
      !hasKeys(metadata.dict, "Type", "Subtype", "Length") ||
      metadata.dict.get(name("Type")) !== name("Metadata") ||
      metadata.dict.get(name("Subtype")) !== name("XML") ||
      new TextDecoder().decode(metadata.getContents()) !==
        identification(profile)
    ) {
      return false
    }

    const intents = catalog.lookup(name("OutputIntents"), PDFArray)
    const intent = intents.lookup(0, PDFDict)
    const icc = rawStream(intent, "DestOutputProfile")
    const profileBytes = icc.getContents()
    if (
      intents.size() !== 1 ||
      !hasKeys(
        intent,
        "Type",
        "S",
        "OutputConditionIdentifier",
        "DestOutputProfile"
      ) ||
      intent.get(name("Type")) !== name("OutputIntent") ||
      intent.get(name("S")) !== name("GTS_PDFA1") ||
      intent.lookup(name("OutputConditionIdentifier"), PDFString).asString() !==
        "sRGB" ||
      !hasKeys(icc.dict, "N", "Length") ||
      icc.dict.lookup(name("N"), PDFNumber).asNumber() !== 3 ||
      profileBytes.length !== srgbProfile.length ||
      !profileBytes.every((byte, index) => byte === srgbProfile[index])
    ) {
      return false
    }

    for (const page of pages) {
      const node = page.node
      const { width, height } = page.getSize()
      const resources = node.lookup(name("Resources"), PDFDict)
      const images = resources.lookup(name("XObject"), PDFDict)
      const image = rawStream(images, "PageImage")
      const content = rawStream(node, "Contents")
      if (
        !(width >= minPageSize && width <= maxPageSize) ||
        !(height >= minPageSize && height <= maxPageSize) ||
        !hasKeys(node, "Type", "Parent", "MediaBox", "Resources", "Contents") ||
        !hasKeys(resources, "XObject") ||
        !hasKeys(images, "PageImage") ||
        !hasKeys(content.dict, "Length") ||
        content.getContentsString() !== pageDrawing(width, height) ||
        !(await isRgbJpeg(image))
      ) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

async function isRgbJpeg({ dict, contents }: PDFRawStream) {
  if (
    !hasKeys(
      dict,
      "Type",
      "Subtype",
      "Width",
      "Height",
      "ColorSpace",
      "BitsPerComponent",
      "Filter",
      "Length"
    ) ||
    dict.get(name("Type")) !== name("XObject") ||
    dict.get(name("Subtype")) !== name("Image") ||
    dict.get(name("ColorSpace")) !== name("DeviceRGB") ||
    dict.get(name("Filter")) !== name("DCTDecode") ||
    dict.lookup(name("BitsPerComponent"), PDFNumber).asNumber() !== 8 ||
    contents.at(-2) !== 0xff ||
    contents.at(-1) !== 0xd9
  ) {
    return false
  }
  const jpeg = await JpegEmbedder.for(contents)
  return (
    jpeg.bitsPerComponent === 8 &&
    jpeg.colorSpace === "DeviceRGB" &&
    jpeg.width === dict.lookup(name("Width"), PDFNumber).asNumber() &&
    jpeg.height === dict.lookup(name("Height"), PDFNumber).asNumber()
  )
}
