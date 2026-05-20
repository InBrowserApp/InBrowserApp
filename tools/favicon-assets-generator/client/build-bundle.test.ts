import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import type { AssetSpec, SourceKey } from "../core/plan"
import { assembleBundle } from "./build-bundle"
import type { ImageSource } from "./types"

let urlCounter = 0
const recordedZipAdds: Array<{ filename: string; readerKind: string }> = []

function makePngStub(size: number, payload = 0): Uint8Array {
  const bytes = new Uint8Array(40)
  bytes[0] = 0x89
  bytes[1] = 0x50
  bytes[2] = 0x4e
  bytes[3] = 0x47
  bytes[4] = 0x0d
  bytes[5] = 0x0a
  bytes[6] = 0x1a
  bytes[7] = 0x0a
  new DataView(bytes.buffer).setUint32(16, size, false)
  new DataView(bytes.buffer).setUint32(20, size, false)
  bytes[39] = payload
  return bytes
}

vi.mock("./render-bitmap", async () => {
  const actual =
    await vi.importActual<typeof import("./render-bitmap")>("./render-bitmap")
  return {
    ...actual,
    renderRaster: vi.fn(async ({ spec }: { spec: { size: number } }) => {
      return new Blob([makePngStub(spec.size, spec.size & 0xff) as BlobPart], {
        type: "image/png",
      })
    }),
    blobToUint8: vi.fn(async (blob: Blob) => {
      return new Uint8Array(await blob.arrayBuffer())
    }),
  }
})

vi.mock("@zip.js/zip.js", () => {
  class BlobWriter {
    constructor(public mimeType: string) {}
  }
  class Uint8ArrayReader {
    readonly kind = "uint8"
    constructor(public bytes: Uint8Array) {}
  }
  class TextReader {
    readonly kind = "text"
    constructor(public text: string) {}
  }
  class ZipWriter {
    constructor(public writer: unknown) {}
    async add(filename: string, reader: { kind: string }) {
      recordedZipAdds.push({ filename, readerKind: reader.kind })
    }
    async close() {
      return new Blob([new Uint8Array([0x50, 0x4b]) as BlobPart], {
        type: "application/zip",
      })
    }
  }
  return { BlobWriter, Uint8ArrayReader, TextReader, ZipWriter }
})

function makeSource(
  objectUrl = "blob:source",
  options: { svgText?: string } = {}
): ImageSource {
  return {
    file: new File([new Uint8Array([1])], "logo.png", { type: "image/png" }),
    width: 256,
    height: 256,
    mimeType: options.svgText ? "image/svg+xml" : "image/png",
    isSvg: Boolean(options.svgText),
    svgText: options.svgText ?? null,
    objectUrl,
    image: {
      naturalWidth: 256,
      naturalHeight: 256,
      width: 256,
      height: 256,
    } as unknown as HTMLImageElement,
  }
}

function makeSourceMap(
  global: ImageSource | null = makeSource()
): Record<SourceKey, ImageSource | null> {
  return {
    global,
    desktop: null,
    ios: null,
    pwa: null,
  }
}

const baseRasterAsset = (
  size: number,
  filename: string,
  platform: "desktop" | "ios" | "pwa-any" | "pwa-maskable"
): AssetSpec => ({
  kind: "raster",
  filename,
  size,
  marginPercent: 0,
  background: null,
  sourceKey: "global",
  platform,
})

beforeEach(() => {
  urlCounter = 0
  recordedZipAdds.length = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:test-${urlCounter++}`
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("assembleBundle", () => {
  test("adds every plan asset to the zip in plan order", async () => {
    const plan: AssetSpec[] = [
      {
        kind: "ico",
        filename: "favicon.ico",
        components: [
          {
            size: 16,
            marginPercent: 0,
            background: null,
            sourceKey: "global",
          },
          {
            size: 32,
            marginPercent: 0,
            background: null,
            sourceKey: "global",
          },
          {
            size: 48,
            marginPercent: 0,
            background: null,
            sourceKey: "global",
          },
        ],
      },
      baseRasterAsset(16, "favicon-16x16.png", "desktop"),
      baseRasterAsset(32, "favicon-32x32.png", "desktop"),
      { kind: "vector", filename: "favicon.svg", sourceKey: "global" },
      baseRasterAsset(180, "apple-touch-icon.png", "ios"),
      baseRasterAsset(192, "pwa-192x192.png", "pwa-any"),
      baseRasterAsset(512, "pwa-512x512.png", "pwa-any"),
      { kind: "manifest", filename: "site.webmanifest" },
    ]

    const bundle = await assembleBundle({
      plan,
      sourceMap: makeSourceMap(
        makeSource("blob:global", { svgText: "<svg/>" })
      ),
      manifestJson: '{"name":"Acme"}\n',
      htmlSnippet: "<link rel=icon>",
      zipName: "Favicon Assets.zip",
    })

    expect(recordedZipAdds.map((entry) => entry.filename)).toEqual([
      "favicon.ico",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "favicon.svg",
      "apple-touch-icon.png",
      "pwa-192x192.png",
      "pwa-512x512.png",
      "site.webmanifest",
    ])
    expect(bundle.assets.map((a) => a.filename)).toEqual(
      recordedZipAdds.map((entry) => entry.filename)
    )
    expect(bundle.includesVectorDesktopIcon).toBe(true)
    expect(bundle.zip.name).toBe("Favicon Assets.zip")
    expect(bundle.manifestJson).toBe('{"name":"Acme"}\n')
    expect(bundle.htmlSnippet).toBe("<link rel=icon>")
  })

  test("skips the vector asset when the effective source has no svgText", async () => {
    const plan: AssetSpec[] = [
      { kind: "vector", filename: "favicon.svg", sourceKey: "global" },
      baseRasterAsset(32, "favicon-32x32.png", "desktop"),
    ]

    const bundle = await assembleBundle({
      plan,
      sourceMap: makeSourceMap(makeSource("blob:no-svg")),
      manifestJson: "{}\n",
      htmlSnippet: "",
      zipName: "Favicon Assets.zip",
    })

    expect(recordedZipAdds.map((entry) => entry.filename)).toEqual([
      "favicon-32x32.png",
    ])
    expect(bundle.assets.map((a) => a.filename)).toEqual(["favicon-32x32.png"])
    expect(bundle.includesVectorDesktopIcon).toBe(false)
  })

  test("uses TextReader for the manifest and Uint8ArrayReader for raster + ico", async () => {
    const plan: AssetSpec[] = [
      baseRasterAsset(32, "favicon-32x32.png", "desktop"),
      { kind: "manifest", filename: "site.webmanifest" },
    ]

    await assembleBundle({
      plan,
      sourceMap: makeSourceMap(),
      manifestJson: "{}\n",
      htmlSnippet: "",
      zipName: "Favicon Assets.zip",
    })

    expect(recordedZipAdds).toEqual([
      { filename: "favicon-32x32.png", readerKind: "uint8" },
      { filename: "site.webmanifest", readerKind: "text" },
    ])
  })

  test("throws when a raster asset has no source image available", async () => {
    const plan: AssetSpec[] = [
      baseRasterAsset(32, "favicon-32x32.png", "desktop"),
    ]

    await expect(
      assembleBundle({
        plan,
        sourceMap: {
          global: null,
          desktop: null,
          ios: null,
          pwa: null,
        },
        manifestJson: "{}\n",
        htmlSnippet: "",
        zipName: "Favicon Assets.zip",
      })
    ).rejects.toThrow("MISSING_SOURCE_FOR_ASSET")
  })
})
