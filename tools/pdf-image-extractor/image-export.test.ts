import { PDFDocument, PDFName } from "pdf-lib"
import { ImageKind } from "pdfjs-dist"
import { afterEach, expect, it, vi } from "vitest"
import { encodePng, openOriginalImages } from "./image-export"

afterEach(() => vi.unstubAllGlobals())

it("returns the original bytes only when PDF properties leave the JPEG self-contained", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage()
  const bytes = new Uint8Array([255, 216, 255, 217])
  const jpeg = pdf.context.register(
    pdf.context.stream(bytes, {
      Filter: "DCTDecode",
      ColorSpace: "DeviceRGB",
    })
  )
  const gray = pdf.context.register(
    pdf.context.stream(bytes, {
      Filter: [PDFName.of("DCTDecode")],
      ColorSpace: "DeviceGray",
    })
  )
  const colorAdjusted = pdf.context.register(
    pdf.context.stream(bytes, {
      Filter: "DCTDecode",
      ColorSpace: "DeviceCMYK",
    })
  )
  const masked = pdf.context.register(
    pdf.context.stream(bytes, {
      Filter: "DCTDecode",
      ColorSpace: "DeviceRGB",
      SMask: jpeg,
    })
  )
  const prefixed = pdf.context.register(
    pdf.context.stream(new Uint8Array([1, ...bytes]), {
      Filter: "DCTDecode",
      ColorSpace: "DeviceRGB",
    })
  )
  const flate = pdf.context.register(pdf.context.flateStream(bytes))
  const find = await openOriginalImages(await pdf.save())
  const read = (object: number) => find(`${object}R`)

  expect(read(jpeg.objectNumber)?.type).toBe("image/jpeg")
  expect(new Uint8Array(await read(jpeg.objectNumber)!.arrayBuffer())).toEqual(
    bytes
  )
  expect(read(gray.objectNumber)?.type).toBe("image/jpeg")
  expect(read(colorAdjusted.objectNumber)).toBeUndefined()
  expect(read(masked.objectNumber)).toBeUndefined()
  expect(read(prefixed.objectNumber)).toBeUndefined()
  expect(read(flate.objectNumber)).toBeUndefined()
  expect(read(999)).toBeUndefined()
  expect(find("invalid")).toBeUndefined()
  expect((await openOriginalImages(new Uint8Array()))("1R")).toBeUndefined()
})

it("encodes RGB, RGBA and row-padded 1-bit grayscale at their original dimensions", async () => {
  const context = {
    createImageData: (width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4),
    }),
    putImageData: vi.fn(),
    drawImage: vi.fn(),
  }
  const convertToBlob = vi.fn(async () => new Blob([], { type: "image/png" }))
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      getContext() {
        return context
      }
      convertToBlob = convertToBlob
    }
  )

  const blob = await encodePng({
    data: new Uint8Array([9, 18, 27]),
    width: 1,
    height: 1,
    kind: ImageKind.RGB_24BPP,
  })
  expect(blob.type).toBe("image/png")
  expect(context.putImageData.mock.lastCall?.[0].data).toEqual(
    new Uint8ClampedArray([9, 18, 27, 255])
  )

  await encodePng({
    data: new Uint8Array([1, 2, 3, 4]),
    width: 1,
    height: 1,
    kind: ImageKind.RGBA_32BPP,
  })
  expect(context.putImageData.mock.lastCall?.[0].data).toEqual(
    new Uint8ClampedArray([1, 2, 3, 4])
  )

  await encodePng({
    data: new Uint8Array([0x80, 0x40]),
    width: 2,
    height: 2,
    kind: ImageKind.GRAYSCALE_1BPP,
  })
  const white = [255, 255, 255, 255]
  const black = [0, 0, 0, 255]
  expect(context.putImageData.mock.lastCall?.[0].data).toEqual(
    new Uint8ClampedArray([...white, ...black, ...black, ...white])
  )
  await encodePng(
    {
      data: new Uint8Array(16),
      width: 2,
      height: 2,
      kind: ImageKind.RGBA_32BPP,
    },
    1,
    1
  )
  expect(context.drawImage).toHaveBeenCalledWith(
    expect.any(OffscreenCanvas),
    0,
    0,
    1,
    1
  )
  expect(() =>
    encodePng({ data: new Uint8Array(), width: 1, height: 1, kind: 0 })
  ).toThrow("Unsupported PDF raster data")
})
