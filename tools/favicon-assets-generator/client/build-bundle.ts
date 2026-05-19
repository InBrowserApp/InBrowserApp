import { encodeIco } from "../core/ico-encoder"
import type {
  AssetSpec,
  IcoAssetSpec,
  RasterAssetSpec,
  SourceKey,
} from "../core/plan"
import { blobToUint8, renderRaster } from "./render-bitmap"
import type { GeneratedAsset, GeneratedBundle, ImageSource } from "./types"

type AssembleInput = Readonly<{
  plan: readonly AssetSpec[]
  sourceMap: Record<SourceKey, ImageSource | null>
  manifestJson: string
  htmlSnippet: string
  zipName: string
}>

/* v8 ignore start -- canvas + zip API path, covered by manual + staging verification */
async function assembleBundle({
  plan,
  sourceMap,
  manifestJson,
  htmlSnippet,
  zipName,
}: AssembleInput): Promise<GeneratedBundle> {
  const { BlobWriter, TextReader, Uint8ArrayReader, ZipWriter } =
    await import("@zip.js/zip.js")

  const generated: GeneratedAsset[] = []
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"))
  let includesVectorDesktopIcon = false

  for (const asset of plan) {
    if (asset.kind === "raster") {
      const blob = await renderRasterFromPlan(asset, sourceMap)
      const bytes = await blobToUint8(blob)
      await zipWriter.add(asset.filename, new Uint8ArrayReader(bytes))
      generated.push({
        filename: asset.filename,
        blob,
        previewUrl: URL.createObjectURL(blob),
        platform: asset.platform,
        size: asset.size,
        byteLength: bytes.byteLength,
      })
    } else if (asset.kind === "ico") {
      const icoBytes = await renderIco(asset, sourceMap)
      const icoBlob = new Blob([icoBytes as BlobPart], {
        type: "image/x-icon",
      })
      await zipWriter.add(asset.filename, new Uint8ArrayReader(icoBytes))
      generated.push({
        filename: asset.filename,
        blob: icoBlob,
        previewUrl: URL.createObjectURL(icoBlob),
        platform: "ico",
        byteLength: icoBytes.byteLength,
      })
    } else if (asset.kind === "vector") {
      const source = sourceMap[asset.sourceKey]
      if (!source?.svgText) {
        continue
      }
      const svgBlob = new Blob([source.svgText], { type: "image/svg+xml" })
      const svgBytes = new Uint8Array(await svgBlob.arrayBuffer())
      await zipWriter.add(asset.filename, new Uint8ArrayReader(svgBytes))
      generated.push({
        filename: asset.filename,
        blob: svgBlob,
        previewUrl: URL.createObjectURL(svgBlob),
        platform: "vector",
        byteLength: svgBytes.byteLength,
      })
      includesVectorDesktopIcon = true
    } else if (asset.kind === "manifest") {
      const manifestBlob = new Blob([manifestJson], {
        type: "application/manifest+json",
      })
      await zipWriter.add(asset.filename, new TextReader(manifestJson))
      generated.push({
        filename: asset.filename,
        blob: manifestBlob,
        previewUrl: URL.createObjectURL(manifestBlob),
        platform: "manifest",
        byteLength: manifestJson.length,
      })
    }
  }

  const zipBlob = (await zipWriter.close()) as Blob

  return {
    assets: generated,
    zip: {
      blob: zipBlob,
      url: URL.createObjectURL(zipBlob),
      name: zipName,
    },
    manifestJson,
    htmlSnippet,
    includesVectorDesktopIcon,
  }
}

async function renderRasterFromPlan(
  asset: RasterAssetSpec,
  sourceMap: Record<SourceKey, ImageSource | null>
): Promise<Blob> {
  const source = sourceMap[asset.sourceKey] ?? sourceMap.global
  if (!source) {
    throw new Error("MISSING_SOURCE_FOR_ASSET")
  }

  return renderRaster({
    spec: {
      size: asset.size,
      marginPercent: asset.marginPercent,
      background: asset.background,
    },
    image: source.image,
  })
}

async function renderIco(
  asset: IcoAssetSpec,
  sourceMap: Record<SourceKey, ImageSource | null>
): Promise<Uint8Array> {
  const components = await Promise.all(
    asset.components.map(async (component) => {
      const source = sourceMap[component.sourceKey] ?? sourceMap.global
      if (!source) {
        throw new Error("MISSING_SOURCE_FOR_ICO")
      }
      const blob = await renderRaster({
        spec: {
          size: component.size,
          marginPercent: component.marginPercent,
          background: component.background,
        },
        image: source.image,
      })
      return blobToUint8(blob)
    })
  )

  return encodeIco(
    components.map((pngBytes) => ({
      pngBytes,
    }))
  )
}
/* v8 ignore stop */

export type { AssembleInput }
export { assembleBundle }
