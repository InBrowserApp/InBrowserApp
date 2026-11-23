import {
  ConfigurationFiles,
  AlphaAction,
  ColorSpace,
  ColorType,
  MagickColor,
  ImageMagick,
  initializeImageMagick,
  MagickFormat,
  MagickImageCollection,
  MagickReadSettings,
} from "@imagemagick/magick-wasm"
import wasmUrl from "@imagemagick/magick-wasm/magick.wasm?url"
import { failureOf } from "../core/failure"
import { detectImage } from "../core/detect"
import { declaredItems } from "../core/item-count"
import { srgbProfile } from "./srgb-profile"
import type {
  ImageInfo,
  Preview,
  SourceKind,
  JpegOptions,
  ImageOutputOptions,
  ImageTransform,
} from "../types"

let source: Uint8Array
let kind: SourceKind
let info: ImageInfo
let initialized: Promise<void> | undefined

function initialize() {
  initialized ??= (async () => {
    const configuration = ConfigurationFiles.default
    configuration.policy.data = `<policymap>
      <policy domain="delegate" rights="none" pattern="*"/>
      <policy domain="filter" rights="none" pattern="*"/>
      <policy domain="coder" rights="none" pattern="*"/>
      <policy domain="coder" rights="read" pattern="{JPEG,PNG,GIF,BMP,BMP2,BMP3,WEBP,AVIF,HEIC,HEIF,JXL,TIFF,ICO,JP2,J2K,JPC}"/>
      <policy domain="coder" rights="read|write" pattern="{PNG,JPEG,WEBP}"/>
      <policy domain="path" rights="none" pattern="*"/>
      <policy domain="path" rights="read|write" pattern="/tmp/magick-*"/>
    </policymap>`
    try {
      await initializeImageMagick(
        new URL(wasmUrl, import.meta.url),
        configuration
      )
    } catch (reason) {
      if (failureOf(reason) === "resourceLimit") throw reason
      throw new Error("engineError", { cause: reason })
    }
  })()
  return initialized
}

export async function inspectImage(file: File) {
  source = new Uint8Array(await file.arrayBuffer())
  kind = detectImage(source)
  const expected = declaredItems(source, kind.format)
  await initialize()
  const collection = MagickImageCollection.create()
  try {
    collection.ping(source, new MagickReadSettings({ format: kind.format }))
    if (
      !collection.length ||
      (expected !== undefined && collection.length !== expected)
    )
      throw new Error("invalid")
    info = {
      format: kind.poster ? "APNG" : kind.format,
      count: collection.length,
      kind:
        kind.format === "TIFF"
          ? "page"
          : kind.format === "ICO"
            ? "variant"
            : ["GIF", "WEBP", "JXL"].includes(kind.format)
              ? "frame"
              : "image",
      poster: kind.poster,
    }
  } finally {
    collection.dispose()
  }
  return info
}

export async function openImage(file: File, jpeg?: JpegOptions) {
  await inspectImage(file)
  return { info, preview: renderImage(0, jpeg) }
}

export function renderImage(
  index: number,
  output?: ImageOutputOptions,
  transform?: ImageTransform
): Preview {
  const jpeg = output && "background" in output ? output : undefined
  const webp = output && "format" in output
  const rotation = transform?.rotation ?? 0
  const size = transform?.maxDimension
  if (
    ![0, 90, 180, 270].includes(rotation) ||
    (size !== undefined && (!Number.isSafeInteger(size) || size <= 0))
  )
    throw new Error("invalid")
  if (
    output &&
    (!Number.isInteger(output.quality) ||
      output.quality < 1 ||
      output.quality > 100)
  )
    throw new Error("invalid")
  if (
    jpeg &&
    (typeof jpeg.background !== "string" ||
      jpeg.background.length !== 7 ||
      !/^#[0-9a-f]{6}$/i.test(jpeg.background))
  )
    throw new Error("invalid")
  if (!Number.isInteger(index) || index < 0 || index >= info.count)
    throw new Error("invalid")
  const animated = info.kind === "frame" && info.count > 1
  const settings = new MagickReadSettings({
    format: kind.format,
    frameIndex: animated ? 0 : index,
    frameCount: animated ? index + 1 : 1,
  })
  return ImageMagick.readCollection(source, settings, (collection) => {
    if (animated) collection.coalesce()
    const image = collection.at(animated ? index : 0)
    if (!image) throw new Error("invalid")
    const depth = image.depth
    const profile = image.getColorProfile() !== null
    image.autoOrient()
    if (rotation) image.rotate(rotation)
    const fullWidth = image.width
    const fullHeight = image.height
    if (size !== undefined && (fullWidth > size || fullHeight > size))
      image.resize(size, size)
    if (jpeg) {
      // Convert before compositing so the selected background is interpreted as sRGB.
      if (!image.transformColorSpace(srgbProfile)) {
        image.colorSpace = ColorSpace.sRGB
        image.setProfile(srgbProfile)
      }
      image.backgroundColor = new MagickColor(jpeg.background)
      image.alpha(AlphaAction.Remove)
      // Keep grayscale pixels in RGB so the JPEG matches its sRGB profile.
      image.settings.colorType = ColorType.TrueColor
    }
    if (output) image.quality = output.quality
    // Q8 decoding already reduces source precision; encode the same 8-bit pixels.
    image.depth = 8
    return image.write(
      jpeg ? MagickFormat.Jpeg : webp ? MagickFormat.WebP : MagickFormat.Png,
      (bytes) => ({
        mime: jpeg ? "image/jpeg" : webp ? "image/webp" : "image/png",
        bytes: new Uint8Array(bytes),
        width: image.width,
        height: image.height,
        fullWidth,
        fullHeight,
        delay: image.animationTicksPerSecond
          ? (image.animationDelay * 1000) / image.animationTicksPerSecond
          : 0,
        depth,
        profile,
      })
    )
  })
}
