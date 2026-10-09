import {
  ConfigurationFiles,
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
import type { ImageInfo, Preview, SourceKind } from "../types"

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
      <policy domain="coder" rights="read|write" pattern="PNG"/>
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

export async function openImage(file: File) {
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
  return { info, preview: renderImage(0) }
}

export function renderImage(index: number): Preview {
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
    const image = collection[animated ? index : 0]
    if (!image) throw new Error("invalid")
    const depth = image.depth
    const profile = image.getColorProfile() !== null
    image.autoOrient()
    return image.write(MagickFormat.Png, (png) => ({
      png: new Uint8Array(png),
      width: image.width,
      height: image.height,
      delay: image.animationTicksPerSecond
        ? (image.animationDelay * 1000) / image.animationTicksPerSecond
        : 0,
      depth,
      profile,
    }))
  })
}
