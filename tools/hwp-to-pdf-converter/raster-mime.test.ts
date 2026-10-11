import { expect, test } from "vitest"
import { checkRaster } from "./raster-mime"
test.each([
  ["png", [137, 80, 78, 71, 13, 10, 26, 10]],
  ["jpeg", [255, 216, 255]],
  ["gif", [71, 73, 70, 56, 57, 97]],
  ["bmp", [66, 77]],
  ["webp", [82, 73, 70, 70, 1, 2, 3, 4, 87, 69, 66, 80]],
] as const)(
  "allows a matching %s header for full browser validation",
  (type, bytes) => {
    expect(() =>
      checkRaster(new Uint8Array(bytes), `image/${type}`)
    ).not.toThrow()
  }
)
test.each([
  ["png", []],
  ["png", [60, 115, 118, 103]],
  ["unknown", [1]],
  ["webp", [82, 73, 70, 70, 1, 2, 3, 4, 87, 65, 86, 69]],
] as const)("rejects mismatched or unsupported %s headers", (type, bytes) => {
  expect(() => checkRaster(new Uint8Array(bytes), `image/${type}`)).toThrow(
    "unsupported"
  )
})
