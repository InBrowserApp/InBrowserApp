import { expect, test } from "vitest"
import { detectImage } from "./detect"
import { assertStillContainer } from "./still-container"
import { failureOf } from "./failure"
const bytes = (...values: number[]) => new Uint8Array(values)
const text = (value: string) => new TextEncoder().encode(value)
const join = (...values: Uint8Array[]) =>
  new Uint8Array(values.flatMap((value) => [...value]))
function box(type: string, body = new Uint8Array(), size = body.length + 8) {
  const data = new Uint8Array(body.length + 8)
  new DataView(data.buffer).setUint32(0, size)
  data.set(text(type), 4)
  data.set(body, 8)
  return data
}
const ftyp = (brand: string) =>
  box("ftyp", join(text(brand), bytes(0, 0, 0, 0)))
const jp2 = bytes(0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10)
const png = bytes(137, 80, 78, 71, 13, 10, 26, 10)

test("detects raster bytes independent of suffix or MIME", () => {
  for (const [data, format] of [
    [bytes(255, 216, 255), "JPEG"],
    [text("GIF87a"), "GIF"],
    [text("GIF89a"), "GIF"],
    [text("BM"), "BMP"],
    [bytes(73, 73, 42, 0), "TIFF"],
    [bytes(77, 77, 0, 42), "TIFF"],
    [bytes(73, 73, 43, 0), "TIFF"],
    [bytes(77, 77, 0, 43), "TIFF"],
    [bytes(0, 0, 1, 0), "ICO"],
    [text("RIFF0000WEBP"), "WEBP"],
    [bytes(255, 10), "JXL"],
    [bytes(0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10), "JXL"],
    [bytes(255, 79, 255, 81), "J2K"],
    [join(jp2, ftyp("jp2 ")), "JP2"],
    [ftyp("avif"), "AVIF"],
    [ftyp("heic"), "HEIC"],
  ] as const)
    expect(detectImage(data)).toEqual({ format, poster: false })
  for (const brand of ["heix", "heif", "mif1"])
    expect(detectImage(ftyp(brand)).format).toBe("HEIC")
  expect(() => detectImage(bytes())).toThrow("emptyFile")
  for (const data of [
    text('<svg><image href="https://example.org/a"/></svg>'),
    text("push graphic-context"),
    text("RIFF0000WAVE"),
    ftyp("text"),
    join(jp2, ftyp("avif")),
    join(jp2, ftyp("heic")),
  ])
    expect(() => detectImage(data)).toThrow("unsupported")
})

test("identifies APNG only from actual bounded control chunks", () => {
  const chunk = (type: string, body = new Uint8Array()) =>
    join(box(type, body, body.length), bytes(0, 0, 0, 0))
  expect(detectImage(png)).toEqual({ format: "PNG", poster: false })
  expect(
    detectImage(join(png, chunk("tEXt", text("acTL")), chunk("IEND")))
  ).toEqual({ format: "PNG", poster: false })
  expect(
    detectImage(join(png, chunk("acTL", bytes(0, 0, 0, 3, 0, 0, 0, 0)))).poster
  ).toBe(true)
  expect(() =>
    detectImage(join(png, box("IHDR", bytes(0, 0, 0, 0), 100)))
  ).toThrow("invalid")
})

test("rejects unsupported compositions and sequence brands", () => {
  for (const brand of [
    "jpx ",
    "jpxb",
    "jpm ",
    "mjp2",
    "avis",
    "msf1",
    "hevc",
    "hevx",
    "heim",
    "heis",
  ])
    expect(() => detectImage(ftyp(brand))).toThrow("sequence")
  for (const type of ["moov", "jpxh", "jplh", "jpch", "comp"])
    expect(() => detectImage(join(ftyp("mif1"), box(type)))).toThrow("sequence")
  expect(() =>
    detectImage(join(jp2, ftyp("jp2 "), box("jp2c"), box("jp2c")))
  ).toThrow("sequence")
  expect(detectImage(join(jp2, ftyp("jp2 "), box("jp2c"))).format).toBe("JP2")
  for (const size of [12, 100, 17])
    expect(() => detectImage(box("ftyp", text("avif00000000"), size))).toThrow(
      "invalid"
    )
})

test("validates ordinary, extended and remainder box lengths without wrapping", () => {
  assertStillContainer(box("mdat", bytes(0, 0, 0), 0))
  assertStillContainer(box("mdat", bytes(0, 0, 0, 0, 0, 0, 0, 16), 1))
  for (const data of [
    bytes(0),
    box("mdat", bytes(), 1),
    box("mdat", bytes(), 7),
    box("mdat", bytes(), 100),
    box("mdat", bytes(255, 255, 255, 255, 255, 255, 255, 255), 1),
  ])
    expect(() => assertStillContainer(data)).toThrow("invalid")
})

test("separates real allocation failure, format failures and unknown errors", () => {
  expect(failureOf(new RangeError("allocation"))).toBe("resourceLimit")
  for (const message of [
    "Aborted(OOM)",
    "unable to allocate memory",
    "MemoryAllocationFailed",
    "CacheResourcesExhausted",
  ])
    expect(failureOf(new Error(message))).toBe("resourceLimit")
  expect(failureOf(new Error("resourceLimit"))).toBe("resourceLimit")
  for (const message of ["emptyFile", "unsupported", "sequence", "engineError"])
    expect(failureOf(new Error(message))).toBe(message)
  expect(failureOf("unexpected")).toBe("invalid")
  expect(failureOf(new Error("corrupt image"))).toBe("invalid")
})
