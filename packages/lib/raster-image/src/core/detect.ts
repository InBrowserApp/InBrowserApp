import type { SourceKind } from "../types"
import { assertStillContainer } from "./still-container"

export function detectImage(bytes: Uint8Array): SourceKind {
  if (!bytes.length) throw new Error("emptyFile")
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const text = (offset: number, length: number) =>
    String.fromCharCode(...bytes.subarray(offset, offset + length))
  const starts = (...values: number[]) =>
    values.every((value, index) => bytes[index] === value)
  const kind = (format: SourceKind["format"], poster = false) => ({
    format,
    poster,
  })
  if (starts(0xff, 0xd8, 0xff)) return kind("JPEG")
  if (starts(137, 80, 78, 71, 13, 10, 26, 10)) {
    let offset = 8
    while (offset + 12 <= bytes.length) {
      const size = view.getUint32(offset)
      if (size > bytes.length - offset - 12) throw new Error("invalid")
      if (text(offset + 4, 4) === "acTL") return kind("PNG", true)
      offset += size + 12
    }
    return kind("PNG")
  }
  if (["GIF87a", "GIF89a"].includes(text(0, 6))) return kind("GIF")
  if (text(0, 2) === "BM") return kind("BMP")
  if (
    starts(73, 73, 42, 0) ||
    starts(77, 77, 0, 42) ||
    starts(73, 73, 43, 0) ||
    starts(77, 77, 0, 43)
  )
    return kind("TIFF")
  if (starts(0, 0, 1, 0)) return kind("ICO")
  if (text(0, 4) === "RIFF" && text(8, 4) === "WEBP") return kind("WEBP")
  if (starts(255, 10) || starts(0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10))
    return kind("JXL")
  if (starts(255, 79, 255, 81)) return kind("J2K")
  const jp2 = starts(0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10)
  const offset = jp2 ? 12 : 0
  if (bytes.length >= offset + 16 && text(offset + 4, 4) === "ftyp") {
    const size = view.getUint32(offset)
    if (size < 16 || size > bytes.length - offset || size % 4 !== 0)
      throw new Error("invalid")
    assertStillContainer(bytes)
    const brand = text(offset + 8, 4)
    // Compositions and timed sequences cannot be represented as an arbitrary first image.
    if (
      [
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
      ].includes(brand)
    )
      throw new Error("sequence")
    if (jp2 && brand === "jp2 ") return kind("JP2")
    if (!jp2 && brand === "avif") return kind("AVIF")
    if (!jp2 && ["heic", "heix", "heif", "mif1"].includes(brand))
      return kind("HEIC")
  }
  throw new Error("unsupported")
}
