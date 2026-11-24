import dicom from "dicom-parser"
import type { DataSet } from "dicom-parser"
import { createTextReader, knownVr, readTags } from "./dicom-metadata"
import { defaultWindow, pixelValues } from "./dicom-pixels"
import type {
  Image,
  Orientation,
  Position,
  Series,
  WindowFunction,
} from "./types"

const implicit = "1.2.840.10008.1.2"
const explicitLittle = "1.2.840.10008.1.2.1"
const explicitBig = "1.2.840.10008.1.2.2"
const nativeSyntaxes = [implicit, explicitLittle, explicitBig]
const losslessSyntaxes = ["1.2.840.10008.1.2.4.57", "1.2.840.10008.1.2.4.70"]

export class UnsupportedImage extends Error {}

function decimal(data: DataSet, tag: string) {
  const value = data.floatString(tag)
  return Number.isFinite(value) ? value : undefined
}

function vector(
  data: DataSet,
  tag: string,
  length: 2
): [number, number] | undefined
function vector(data: DataSet, tag: string, length: 3): Position | undefined
function vector(data: DataSet, tag: string, length: 6): Orientation | undefined
function vector(data: DataSet, tag: string, length: number) {
  const parts = data.string(tag)?.split("\\").map(Number)
  return parts?.length === length && parts.every(Number.isFinite)
    ? parts
    : undefined
}

function syntaxForRawData(bytes: Uint8Array) {
  if (String.fromCharCode(...bytes.subarray(128, 132)) === "DICM")
    return undefined
  const vr = String.fromCharCode(...bytes.subarray(4, 6))
  return /^[A-Z]{2}$/.test(vr) ? explicitLittle : implicit
}

function group(data: DataSet | undefined, tag: string, index = 0) {
  return data?.elements[tag]?.items?.[index]?.dataSet
}

export function readImage(buffer: ArrayBuffer, fileName: string): Image {
  const bytes = new Uint8Array(buffer)
  const rawSyntax = syntaxForRawData(bytes)
  const data = dicom.parseDicom(bytes, {
    TransferSyntaxUID: rawSyntax,
    vrCallback: knownVr,
  })
  const syntax = rawSyntax ?? data.string("x00020010")
  const lossless = losslessSyntaxes.includes(syntax ?? "")
  const pixel = data.elements.x7fe00010
  const width = data.uint16("x00280011")
  const height = data.uint16("x00280010")
  const allocated = data.uint16("x00280100")
  const stored = data.uint16("x00280101") ?? allocated
  const highBit = data.uint16("x00280102") ?? (stored ?? 0) - 1
  const frameCount = data.intString("x00280008") ?? 1
  const photo = data.string("x00280004")
  const inverted =
    (data.string("x20500020") ??
      (photo === "MONOCHROME1" ? "INVERSE" : "IDENTITY")) === "INVERSE"

  if (
    !pixel ||
    !width ||
    !height ||
    !Number.isSafeInteger(frameCount) ||
    frameCount < 1
  ) {
    throw new Error("Missing or invalid DICOM image data")
  }
  if (
    (!lossless && !nativeSyntaxes.includes(syntax ?? "")) ||
    (photo !== "MONOCHROME1" && photo !== "MONOCHROME2") ||
    (data.uint16("x00280002") ?? 1) !== 1 ||
    (allocated !== 8 && allocated !== 16) ||
    !stored ||
    stored > allocated ||
    highBit !== stored - 1
  ) {
    throw new UnsupportedImage("Unsupported DICOM image encoding")
  }

  const pixelCount = width * height
  const frameBytes = pixelCount * (allocated / 8)
  const swapBytePairs =
    syntax === explicitBig && allocated === 8 && pixel.vr === "OW"
  const requiredBytes = frameCount * frameBytes
  if (
    lossless
      ? !pixel.encapsulatedPixelData ||
        frameCount > (pixel.fragments?.length ?? 0)
      : pixel.encapsulatedPixelData ||
        requiredBytes + (swapBytePairs ? requiredBytes % 2 : 0) >
          pixel.length ||
        pixel.dataOffset + pixel.length > data.byteArray.length
  ) {
    throw new Error("Incomplete DICOM pixel data")
  }

  const text = createTextReader(data)
  const shared = group(data, "x52009229")
  const signed = data.uint16("x00280103") === 1
  const paddingValue = signed
    ? data.int16("x00280120")
    : data.uint16("x00280120")
  const paddingLimit =
    (signed ? data.int16("x00280121") : data.uint16("x00280121")) ??
    paddingValue
  const padding =
    paddingValue !== undefined && paddingLimit !== undefined
      ? ([
          Math.min(paddingValue, paddingLimit),
          Math.max(paddingValue, paddingLimit),
        ] as const)
      : undefined
  let offsets = pixel.basicOffsetTable
  return {
    fileName,
    seriesId: data.string("x0020000e"),
    description: text(data.elements.x0008103e),
    modality: data.string("x00080060"),
    instance: decimal(data, "x00200013"),
    position: vector(data, "x00200032", 3),
    orientation: vector(data, "x00200037", 6),
    frameCount,
    async frame(index) {
      let encoded: Uint8Array
      if (lossless) {
        offsets = offsets?.length
          ? offsets
          : dicom.createJPEGBasicOffsetTable(data, pixel)
        const compressed = dicom.readEncapsulatedImageFrame(
          data,
          pixel,
          index,
          offsets
        )
        const { Decoder } = await import("jpeg-lossless-decoder-js")
        encoded = new Uint8Array(
          new Decoder(null, allocated / 8).decompress(
            Uint8Array.from(compressed).buffer,
            0,
            compressed.byteLength
          )
        )
        if (encoded.byteLength !== frameBytes)
          throw new Error("Unexpected decoded frame length")
      } else if (swapBytePairs) {
        encoded = new Uint8Array(frameBytes)
        for (let i = 0; i < frameBytes; i++) {
          // With OW, byte swapping applies to the entire pixel element, not each frame.
          const offset = index * frameBytes + i
          const paired = offset % 2 === 0 ? offset + 1 : offset - 1
          encoded[i] = data.byteArray[pixel.dataOffset + paired]!
        }
      } else {
        const start = pixel.dataOffset + index * frameBytes
        encoded = data.byteArray.subarray(start, start + frameBytes)
      }

      const perFrame = group(data, "x52009230", index)
      const transform =
        group(perFrame, "x00289145") ?? group(shared, "x00289145") ?? data
      const voi =
        group(perFrame, "x00289132") ?? group(shared, "x00289132") ?? data
      const measures =
        group(perFrame, "x00289110") ?? group(shared, "x00289110") ?? data
      const spacing =
        vector(measures, "x00280030", 2) ?? vector(data, "x00280034", 2)
      const pixelRatio = spacing?.every((value) => value > 0)
        ? spacing[1] / spacing[0]
        : 1
      const { pixels, min, max } = pixelValues(encoded, {
        count: pixelCount,
        allocated,
        stored,
        signed,
        padding,
        littleEndian: syntax !== explicitBig,
        slope: decimal(transform, "x00281053") ?? 1,
        intercept: decimal(transform, "x00281052") ?? 0,
      })
      const level = decimal(voi, "x00281050")
      const windowWidth = decimal(voi, "x00281051")
      const fn = voi.string("x00281056")
      const windowFunction: WindowFunction =
        fn === "SIGMOID" || fn === "LINEAR_EXACT" ? fn : "LINEAR"
      const hasWindow =
        level !== undefined &&
        windowWidth !== undefined &&
        (windowFunction === "LINEAR" ? windowWidth >= 1 : windowWidth > 0)
      return {
        width,
        height,
        pixels,
        inverted,
        aspectRatio: (width / height) * pixelRatio,
        window: hasWindow
          ? { width: windowWidth, level }
          : defaultWindow(min, max),
        windowFunction: hasWindow ? windowFunction : "LINEAR",
      }
    },
    tags: () => readTags(data, text),
  }
}

function spatialOrder(images: Image[]) {
  const reference = images[0]?.orientation
  if (
    !reference ||
    !images.every(
      ({ position, orientation }) =>
        position &&
        orientation?.every(
          (value, index) => Math.abs(value - reference[index]!) < 0.001
        )
    )
  )
    return
  const [a, b, c, d, e, f] = reference
  const nx = b * f - c * e
  const ny = c * d - a * f
  const nz = a * e - b * d
  return (image: Image) => {
    const [x, y, z] = image.position!
    return x * nx + y * ny + z * nz
  }
}

function groupSeries(images: Image[], lang: string): Series[] {
  const names = new Intl.Collator(lang, { numeric: true })
  const groups = new Map<string | Image, Image[]>()
  for (const image of images) {
    const key = image.seriesId || image
    const group = groups.get(key)
    if (group) group.push(image)
    else groups.set(key, [image])
  }
  return [...groups.values()].map((grouped) => {
    const location = spatialOrder(grouped)
    grouped.sort(
      (a, b) =>
        (location ? location(a) - location(b) : 0) ||
        (a.instance ?? Infinity) - (b.instance ?? Infinity) ||
        names.compare(a.fileName, b.fileName)
    )
    return {
      images: grouped,
      description: grouped.find((image) => image.description)?.description,
      modality: grouped.find((image) => image.modality)?.modality,
      frameCount: grouped.reduce((total, image) => total + image.frameCount, 0),
    }
  })
}

export async function openFiles(
  files: File[],
  lang: string,
  signal: AbortSignal
) {
  const images: Image[] = []
  const skipped: Array<{ name: string; unsupported: boolean }> = []
  for (const file of files) {
    signal.throwIfAborted()
    try {
      images.push(readImage(await file.arrayBuffer(), file.name))
    } catch (error) {
      skipped.push({
        name: file.name,
        unsupported: error instanceof UnsupportedImage,
      })
    }
  }
  return { series: groupSeries(images, lang), skipped }
}
