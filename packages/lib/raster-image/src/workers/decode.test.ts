// @vitest-environment node
import { readFileSync } from "node:fs"
import { expect, test, vi } from "vitest"
import { ImageMagick } from "@imagemagick/magick-wasm"
import { inspectImage, openImage, renderImage } from "./decode"

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
  expect(pixel(second.bytes, 10, 10)).toEqual([20, 132, 150])
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
  expect(reduced.bytes[24]).toBeLessThanOrEqual(8) // PNG IHDR bit depth
  expect(pixel(reduced.bytes, 10, 10)[0]).toBe(128)
  const transparent = (await openImage(fixture("color-chart.png"))).preview
  ImageMagick.read(transparent.bytes, (image) => {
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
    expect(pixel(result.preview.bytes, 10, 10)[0]).toBeGreaterThan(225)
  }
})

test("coalesces real optimized GIF/WebP deltas and labels APNG's poster", async () => {
  for (const name of ["animation.gif", "animation.animated.webp"]) {
    const opened = await openImage(fixture(name))
    expect(opened.info).toMatchObject({ count: 3, kind: "frame" })
    const second = renderImage(1)
    expect([second.width, second.height, second.delay]).toEqual([100, 100, 200])
    expect(
      pixel(second.bytes, 10, 10).every(
        (v, i) => Math.abs(v - [232, 92, 40][i]!) < 8
      )
    ).toBe(true)
    expect(
      pixel(second.bytes, 30, 30).every(
        (v, i) => Math.abs(v - [20, 132, 150][i]!) < 8
      )
    ).toBe(true)
    const third = renderImage(2)
    expect([third.width, third.height, third.delay]).toEqual([100, 100, 300])
    expect(
      pixel(third.bytes, 80, 80).every(
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

test("rejects nonnumeric worker indices without touching a prototype", async () => {
  await openImage(fixture("animation.gif"))
  const before = Object.getOwnPropertyDescriptor(Object.prototype, "depth")
  for (const value of [
    "__proto__",
    "constructor",
    "prototype",
    "1",
    null,
    {},
    Infinity,
  ]) {
    expect(() => renderImage(value as unknown as number)).toThrow("invalid")
  }
  expect(Object.getOwnPropertyDescriptor(Object.prototype, "depth")).toEqual(
    before
  )
  expect(renderImage(1).width).toBe(100)
})

test("writes actual 8-bit JPEGs with the selected quality, flattened background and sRGB profile", async () => {
  const output = await openImage(fixture("color-chart.png"), {
    quality: 90,
    background: "#ffffff",
  })
  expect(output.preview.mime).toBe("image/jpeg")
  expect(output.preview.bytes.slice(0, 3)).toEqual(
    new Uint8Array([255, 216, 255])
  )
  for (const [background, expected] of [
    ["#ffffff", [167, 210, 159]],
    ["#000000", [40, 83, 32]],
    ["#102030", [48, 99, 56]],
  ] as const) {
    const result = renderImage(0, { quality: 90, background })
    expect(
      pixel(result.bytes, 200, 150).every(
        (value, i) => Math.abs(value - expected[i]!) < 4
      )
    ).toBe(true)
    ImageMagick.read(result.bytes, (image) => {
      expect([image.width, image.height, image.depth, image.hasAlpha]).toEqual([
        320,
        200,
        8,
        false,
      ])
      expect(image.getColorProfile()?.colorSpace).toBe(23)
    })
  }
  const low = renderImage(0, { quality: 25, background: "#ffffff" })
  expect(low.bytes.length).toBeLessThan(output.preview.bytes.length)
  // Re-encoding never mutates the retained source: PNG still has its alpha.
  const png = renderImage(0)
  expect(png.mime).toBe("image/png")
  ImageMagick.read(png.bytes, (image) => expect(image.hasAlpha).toBe(true))
  const profiled = await openImage(fixture("profiled.png"), {
    quality: 100,
    background: "#102030",
  })
  expect(profiled.preview.profile).toBe(true)
  expect(
    pixel(profiled.preview.bytes, 200, 150).every(
      (value, i) => Math.abs(value - [48, 99, 56][i]!) < 3
    )
  ).toBe(true)
  const oriented = await openImage(fixture("orientation-6.jpg"), {
    quality: 1,
    background: "#FFFFFF",
  })
  expect([oriented.preview.width, oriented.preview.height]).toEqual([200, 320])
})

test("rejects invalid JPEG settings without invalidating a valid source", async () => {
  await openImage(fixture("pages.tiff"))
  for (const quality of [0, 101, NaN, 1.5, Infinity, "90"]) {
    expect(() =>
      renderImage(1, { quality: quality as number, background: "#ffffff" })
    ).toThrow("invalid")
  }
  for (const background of [
    "white",
    "#fff",
    "#fffffff",
    "url(https://example.test)",
    "#ffffff\n",
  ]) {
    expect(() => renderImage(1, { quality: 90, background })).toThrow("invalid")
  }
  const second = renderImage(1, { quality: 90, background: "#ffffff" })
  expect([second.width, second.height, second.mime]).toEqual([
    200,
    320,
    "image/jpeg",
  ])
  expect(
    pixel(second.bytes, 10, 10).every(
      (value, i) => Math.abs(value - [20, 132, 150][i]!) < 3
    )
  ).toBe(true)
})

test("encodes grayscale sources as RGB JPEG matching the sRGB output profile", async () => {
  const gray = await openImage(fixture("high-depth.tiff"), {
    quality: 90,
    background: "#ffffff",
  })
  ImageMagick.read(gray.preview.bytes, (image) => {
    expect(image.colorSpace).toBe(23)
    expect(image.getColorProfile()?.colorSpace).toBe(23)
    expect(
      image.getPixels((pixels) => [...pixels.getPixel(10, 10)].slice(0, 3))
    ).toEqual([128, 128, 128])
  })
})

test("inspects TIFF without rendering, fits thumbnails and exports full-size clockwise rotation", async () => {
  expect(await inspectImage(fixture("pages.tiff"))).toMatchObject({
    count: 3,
    kind: "page",
  })
  const thumb = renderImage(1, undefined, { maxDimension: 192 })
  expect([
    thumb.width,
    thumb.height,
    thumb.fullWidth,
    thumb.fullHeight,
  ]).toEqual([120, 192, 200, 320])
  expect(renderImage(2, undefined, { maxDimension: 192 }).width).toBe(100)
  await inspectImage(fixture("color-chart.png"))
  const rotated = renderImage(
    0,
    { quality: 92, background: "#ffffff" },
    { rotation: 90 }
  )
  expect([
    rotated.width,
    rotated.height,
    rotated.fullWidth,
    rotated.fullHeight,
  ]).toEqual([200, 320, 200, 320])
  expect(
    pixel(rotated.bytes, 10, 10).every(
      (v, i) => Math.abs(v - [232, 92, 40][i]!) < 4
    )
  ).toBe(true)
  expect(
    pixel(rotated.bytes, 190, 300).every(
      (v, i) => Math.abs(v - [20, 132, 150][i]!) < 4
    )
  ).toBe(true)
  expect(renderImage(0).width).toBe(320)
  for (const rotation of [-90, 45, NaN, "90"])
    expect(() =>
      renderImage(0, undefined, { rotation: rotation as 90 })
    ).toThrow("invalid")
  for (const maxDimension of [0, -1, NaN, Infinity, 1.2])
    expect(() => renderImage(0, undefined, { maxDimension })).toThrow("invalid")
})

test("retains later TIFF pages when one strip offset points beyond the file", async () => {
  const bytes = new Uint8Array(await fixture("pages.tiff").arrayBuffer())
  const view = new DataView(bytes.buffer)
  const little = bytes[0] === 73
  const first = view.getUint32(4, little)
  const second = view.getUint32(
    first + 2 + view.getUint16(first, little) * 12,
    little
  )
  for (let i = 0; i < view.getUint16(second, little); i++) {
    const entry = second + 2 + i * 12
    if (view.getUint16(entry, little) !== 273) continue // StripOffsets
    const count = view.getUint32(entry + 4, little)
    const offset = count === 1 ? entry + 8 : view.getUint32(entry + 8, little)
    for (let strip = 0; strip < count; strip++)
      view.setUint32(offset + strip * 4, bytes.length + 100000, little)
  }
  expect(
    await inspectImage(new File([bytes], "broken-middle.tiff"))
  ).toMatchObject({ count: 3 })
  expect(renderImage(0).width).toBe(320)
  expect(() => renderImage(1)).toThrow(/TIFF|strip|read/i)
  const third = renderImage(2)
  expect([third.width, third.height]).toEqual([100, 100])
  expect(pixel(third.bytes, 10, 10)).toEqual([232, 92, 40])
})
