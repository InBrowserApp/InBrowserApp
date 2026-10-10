// @vitest-environment node
import { readFileSync } from "node:fs"
import { expect, test, vi } from "vitest"
import { ImageMagick } from "@imagemagick/magick-wasm"
import { openImage, renderImage } from "./decode"

vi.mock("@imagemagick/magick-wasm", async (original) => {
  const module = await original<typeof import("@imagemagick/magick-wasm")>()
  return {
    ...module,
    initializeImageMagick: (
      _url: URL,
      config: Parameters<typeof module.initializeImageMagick>[1]
    ) =>
      module.initializeImageMagick(
        readFileSync(
          new URL(
            "../../node_modules/@imagemagick/magick-wasm/dist/x86/magick.wasm",
            import.meta.url
          )
        ),
        config
      ),
  }
})
const fixture = (name: string) =>
  new File(
    [
      readFileSync(
        new URL(
          `../../../../../tools/image-viewer/fixtures/${name}`,
          import.meta.url
        )
      ),
    ],
    name
  )
const pixel = (png: Uint8Array, x: number, y: number) =>
  ImageMagick.read(png, (image) =>
    image.getPixels((pixels) => [...pixels.getPixel(x, y)].slice(0, 3))
  )

test("reads real TIFF pages, applies orientation and retains profile metadata", async () => {
  const opened = await openImage(fixture("pages.tiff"))
  expect(opened.info).toEqual({
    format: "TIFF",
    kind: "page",
    count: 3,
    poster: false,
  })
  expect([opened.preview.width, opened.preview.height]).toEqual([320, 200])
  const second = renderImage(1)
  expect([second.width, second.height]).toEqual([200, 320])
  expect(pixel(second.png, 10, 10)).toEqual([20, 132, 150])
  const third = renderImage(2)
  expect([third.width, third.height]).toEqual([100, 100])
  for (const index of [-1, 3, NaN, 1.5])
    expect(() => renderImage(index)).toThrow("invalid")
  const big = (await openImage(fixture("big.tiff"))).preview
  expect([big.width, big.height]).toEqual([73, 91])
  const oriented = (await openImage(fixture("orientation-6.jpg"))).preview
  expect([oriented.width, oriented.height]).toEqual([200, 320])
  expect((await openImage(fixture("profiled.png"))).preview.profile).toBe(true)
  const reduced = (await openImage(fixture("high-depth.tiff"))).preview
  expect(reduced.depth).toBe(16)
  expect(reduced.png[24]).toBeLessThanOrEqual(8) // PNG IHDR bit depth
  expect(pixel(reduced.png, 10, 10)[0]).toBe(128)
  const transparent = (await openImage(fixture("color-chart.png"))).preview
  ImageMagick.read(transparent.png, (image) => {
    expect(image.width).toBe(320)
    expect(image.height).toBe(200)
    image.getPixels((pixels) => expect(pixels.getPixel(200, 150)[3]).toBe(128))
  })
})

test("browses actual icon variants and reads AVIF/JXL/JP2 pixels", async () => {
  const opened = await openImage(fixture("multi-size.ico"))
  expect(opened.info).toMatchObject({ count: 5, kind: "variant" })
  expect([opened.preview.width, renderImage(4).width]).toEqual([16, 256])
  for (const name of [
    "color-chart.png",
    "color-chart.avif",
    "color-chart.jxl",
    "color-chart.jp2",
    "color-chart.j2k",
  ]) {
    const result = await openImage(fixture(name))
    expect([result.preview.width, result.preview.height]).toEqual([320, 200])
    expect(pixel(result.preview.png, 10, 10)[0]).toBeGreaterThan(225)
  }
})

test("coalesces real optimized GIF/WebP deltas and labels APNG's poster", async () => {
  for (const name of ["animation.gif", "animation.animated.webp"]) {
    const opened = await openImage(fixture(name))
    expect(opened.info).toMatchObject({ count: 3, kind: "frame" })
    const second = renderImage(1)
    expect([second.width, second.height, second.delay]).toEqual([100, 100, 200])
    expect(
      pixel(second.png, 10, 10).every(
        (v, i) => Math.abs(v - [232, 92, 40][i]!) < 8
      )
    ).toBe(true)
    expect(
      pixel(second.png, 30, 30).every(
        (v, i) => Math.abs(v - [20, 132, 150][i]!) < 8
      )
    ).toBe(true)
    const third = renderImage(2)
    expect([third.width, third.height, third.delay]).toEqual([100, 100, 300])
    expect(
      pixel(third.png, 80, 80).every(
        (v, i) => Math.abs(v - [80, 166, 63][i]!) < 8
      )
    ).toBe(true)
  }
  expect((await openImage(fixture("animation.apng"))).info).toEqual({
    format: "APNG",
    poster: true,
    kind: "image",
    count: 1,
  })
})

test("rejects disguised executable descriptions, malformed raster and file read errors", async () => {
  await expect(
    openImage(new File(['<svg onload="alert(1)"/>'], "image.png"))
  ).rejects.toThrow("unsupported")
  await expect(
    openImage(new File([new Uint8Array([255, 216, 255])], "bad.jpg"))
  ).rejects.toThrow(/InsufficientImageData|JPEG/)
  await expect(
    openImage({
      arrayBuffer: () => Promise.reject(new RangeError("allocation")),
    } as File)
  ).rejects.toThrow("allocation")
})
