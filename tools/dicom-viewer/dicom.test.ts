import { describe, expect, it } from "vitest"
import { openFiles, readImage, UnsupportedImage } from "./dicom"
import { rgba } from "./dicom-pixels"

function words(values: number[], littleEndian = true) {
  const bytes = new Uint8Array(values.length * 2)
  const view = new DataView(bytes.buffer)
  values.forEach((value, index) =>
    view.setUint16(index * 2, value, littleEndian)
  )
  return bytes
}

function element(
  tag: string,
  vr: string,
  contents: string | Uint8Array,
  littleEndian = true,
  implicit = false,
  undefinedLength = false
) {
  const body =
    typeof contents === "string"
      ? new TextEncoder().encode(
          contents.length % 2 ? contents + (vr === "UI" ? "\0" : " ") : contents
        )
      : contents
  const wide = implicit || ["OB", "OW", "SQ"].includes(vr)
  const header = new Uint8Array(implicit ? 8 : wide ? 12 : 8)
  const view = new DataView(header.buffer)
  view.setUint16(0, Number.parseInt(tag.slice(0, 4), 16), littleEndian)
  view.setUint16(2, Number.parseInt(tag.slice(4), 16), littleEndian)
  if (!implicit) header.set(new TextEncoder().encode(vr), 4)
  if (wide)
    view.setUint32(
      implicit ? 4 : 8,
      undefinedLength ? 0xffffffff : body.length,
      littleEndian
    )
  else view.setUint16(6, body.length, littleEndian)
  return Buffer.concat([header, body])
}

const baseline = "1.2.840.10008.1.2.1"

function file({
  syntax = baseline,
  series = "1.2.3",
  instance = 1,
  z = 0,
  stored = 12,
  allocated = 16,
  photo = "MONOCHROME2",
  frameCount = 1,
  rows = 2,
  cols = 2,
  pixels,
  extras = [],
  raw = false,
  pixelVr = "OW",
  malformed = false,
  oriented = true,
}: {
  syntax?: string
  series?: string
  instance?: number
  z?: number
  stored?: number
  allocated?: number
  photo?: string
  frameCount?: number
  rows?: number
  cols?: number
  pixels?: Uint8Array
  extras?: Array<[string, string, string | Uint8Array]>
  raw?: boolean
  pixelVr?: string
  malformed?: boolean
  oriented?: boolean
} = {}) {
  const littleEndian = syntax !== "1.2.840.10008.1.2.2"
  const implicit = syntax === "1.2.840.10008.1.2"
  const compressed = syntax.startsWith("1.2.840.10008.1.2.4.")
  const data: Array<[string, string, string | Uint8Array]> = [
    ["00080005", "CS", "ISO_IR 192"],
    ["00080060", "CS", "CT"],
    ["0008103E", "LO", Uint8Array.from(Buffer.from("樣本"))],
    ["0020000E", "UI", series],
    ["00200013", "IS", String(instance)],
    ["00200032", "DS", `0\\0\\${z}`],
    ...(oriented ? [["00200037", "DS", "1\\0\\0\\0\\1\\0"] as const] : []).map(
      (value) => [...value] as [string, string, string]
    ),
    ["00280002", "US", words([1], littleEndian)],
    ["00280004", "CS", photo],
    ["00280008", "IS", String(frameCount)],
    ["00280010", "US", words([rows], littleEndian)],
    ["00280011", "US", words([cols], littleEndian)],
    ["00280100", "US", words([allocated], littleEndian)],
    ["00280101", "US", words([stored], littleEndian)],
    ["00280102", "US", words([stored - 1], littleEndian)],
    ["00280103", "US", words([1], littleEndian)],
    ...extras,
  ]
  const payload =
    pixels ??
    (allocated === 16
      ? words([4095, 0, 4, 16], littleEndian)
      : Uint8Array.of(0, 32, 64, 96))
  return Buffer.concat([
    ...(raw
      ? []
      : [
          Buffer.alloc(128),
          Buffer.from("DICM"),
          element("00020010", "UI", syntax),
        ]),
    ...data.map(([tag, vr, value]) =>
      element(tag, vr, value, littleEndian, implicit)
    ),
    element("7FE00010", pixelVr, payload, littleEndian, implicit, compressed),
    ...(malformed ? [element("80000007", "US", Uint8Array.of(255))] : []),
  ])
}

function buffer(bytes: Uint8Array) {
  return Uint8Array.from(bytes).buffer
}

function input(name: string, bytes: Uint8Array) {
  return new File([buffer(bytes)], name)
}

describe("DICOM image decoding", () => {
  it("resolves signed stored samples, rescales, and uses the DICOM display window", async () => {
    const image = readImage(
      buffer(
        file({
          extras: [
            ["00280030", "DS", "0.5\\1.5"],
            ["00281050", "DS", "0"],
            ["00281051", "DS", "20"],
            ["00281052", "DS", "-10"],
            ["00281053", "DS", "2"],
          ],
        })
      ),
      "CT"
    )
    const frame = await image.frame(0)
    expect(Array.from(frame.pixels)).toEqual([-12, -10, -2, 22])
    expect(frame.aspectRatio).toBe(3)
    expect(frame.window).toEqual({ width: 20, level: 0 })
    expect(Array.from(rgba(frame, frame.window))).toEqual([
      0, 0, 0, 255, 0, 0, 0, 255, 107, 107, 107, 255, 255, 255, 255, 255,
    ])
  })

  it("excludes pixel padding from the fallback window and applies MONOCHROME1", async () => {
    const image = readImage(
      buffer(
        file({
          photo: "MONOCHROME1",
          pixels: words([0x800, 9, 13, 19]),
          extras: [["00280120", "SS", words([-2048])]],
        })
      ),
      "mri.dcm"
    )
    const frame = await image.frame(0)
    expect(frame.window).toEqual({ width: 11, level: 14.5 })
    expect(
      Array.from(rgba(frame, frame.window)).filter(
        (_, index) => index % 4 === 0
      )
    ).toEqual([0, 255, 153, 0])
  })

  it("opens raw implicit and explicit datasets and reads multi-valued attribute tags", async () => {
    const extras: Array<[string, string, Uint8Array]> = [
      ["00280009", "AT", words([0x18, 0x1063, 0x18, 0x1065])],
    ]
    for (const syntax of [baseline, "1.2.840.10008.1.2"]) {
      const image = readImage(
        buffer(file({ syntax, raw: true, extras })),
        "IMAGE1"
      )
      expect(image.description).toBe("樣本")
      expect(image.tags()).toContainEqual({
        id: "0028,0009",
        name: "Frame Increment Pointer",
        value: "0018,1063\\0018,1065",
      })
    }
  })

  it("skips malformed numeric metadata while leaving image pixels available", async () => {
    const image = readImage(buffer(file({ malformed: true })), "image.dcm")
    expect((await image.frame(0)).pixels[0]).toBe(-1)
    expect(image.tags().some((tag) => tag.id === "8000,0007")).toBe(false)
  })

  it("reads big-endian sixteen-bit samples and byte-swapped OW across odd-length frames", async () => {
    const syntax = "1.2.840.10008.1.2.2"
    const big = readImage(buffer(file({ syntax })), "big.dcm")
    expect(Array.from((await big.frame(0)).pixels)).toEqual([-1, 0, 4, 16])

    const swapped = readImage(
      buffer(
        file({
          syntax,
          allocated: 8,
          stored: 8,
          frameCount: 2,
          rows: 1,
          cols: 3,
          pixels: Uint8Array.of(2, 1, 4, 3, 6, 5),
        })
      ),
      "ow.dcm"
    )
    expect(Array.from((await swapped.frame(0)).pixels)).toEqual([1, 2, 3])
    expect(Array.from((await swapped.frame(1)).pixels)).toEqual([4, 5, 6])
  })

  it("decodes JPEG Lossless with 8 stored bits in a 16-bit pixel container", async () => {
    // A 2 × 2 grayscale lossless JPEG with four midpoint samples.
    const jpeg = Buffer.from(
      "ffd8ffc40014000100000000000000000000000000000000ffc3000b080002000201011100ffda00080101000100000fffd900",
      "hex"
    )
    const item = (tag: string, data: Uint8Array) =>
      element(tag, "", data, true, true)
    const image = readImage(
      buffer(
        file({
          syntax: "1.2.840.10008.1.2.4.70",
          stored: 8,
          allocated: 16,
          pixelVr: "OB",
          pixels: Buffer.concat([
            item("FFFEE000", words([0, 0])),
            item("FFFEE000", jpeg),
            item("FFFEE0DD", new Uint8Array()),
          ]),
        })
      ),
      "lossless.dcm"
    )
    expect(Array.from((await image.frame(0)).pixels)).toEqual([
      -128, -128, -128, -128,
    ])
  })

  it("rejects unsupported photometry and truncated pixel data", () => {
    expect(() => readImage(buffer(file({ photo: "RGB" })), "rgb.dcm")).toThrow(
      UnsupportedImage
    )
    expect(() =>
      readImage(buffer(file({ frameCount: 2 })), "truncated.dcm")
    ).toThrow("Incomplete DICOM pixel data")
  })
})

describe("local import", () => {
  it("groups by series, sorts by position, and keeps valid images among skipped files", async () => {
    const result = await openFiles(
      [
        input("higher.dcm", file({ z: 20, instance: 1 })),
        input("other.dcm", file({ series: "1.2.4" })),
        input("lower.dcm", file({ z: -20, instance: 2 })),
        input("rgb.dcm", file({ photo: "RGB" })),
        new File(["no image"], "readme.txt"),
      ],
      "en",
      new AbortController().signal
    )
    expect(
      result.series.map((series) =>
        series.images.map(({ fileName }) => fileName)
      )
    ).toEqual([["lower.dcm", "higher.dcm"], ["other.dcm"]])
    expect(result.skipped).toEqual([
      { name: "rgb.dcm", unsupported: true },
      { name: "readme.txt", unsupported: false },
    ])
  })

  it("falls back to instance order and stops canceled imports", async () => {
    const files = [
      input("first.dcm", file({ instance: 9, oriented: false })),
      input("second.dcm", file({ instance: 2, oriented: false })),
    ]
    const result = await openFiles(files, "en", new AbortController().signal)
    expect(
      result.series.flatMap(({ images }) =>
        images.map(({ fileName }) => fileName)
      )
    ).toEqual(["second.dcm", "first.dcm"])
    await expect(
      openFiles(files, "en", AbortSignal.abort(new Error("Canceled")))
    ).rejects.toThrow("Canceled")
  })
})
