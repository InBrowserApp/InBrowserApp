import { expect, test } from "vitest"
import { declaredItems } from "./item-count"
function tiff(big: boolean, little: boolean) {
  const bytes = new Uint8Array(80)
  const view = new DataView(bytes.buffer)
  bytes.set(little ? [73, 73] : [77, 77])
  view.setUint16(2, big ? 43 : 42, little)
  if (big) {
    view.setUint16(4, 8, little)
    view.setBigUint64(8, 16n, little)
    view.setBigUint64(24, 48n, little)
  } else {
    view.setUint32(4, 8, little)
    view.setUint32(10, 20, little)
  }
  return { bytes, view }
}
test("counts both byte orders of TIFF and BigTIFF without an item cap", () => {
  for (const big of [true, false])
    for (const little of [true, false])
      expect(declaredItems(tiff(big, little).bytes, "TIFF")).toBe(2)
  expect(declaredItems(new Uint8Array([0, 0, 1, 0, 5, 0]), "ICO")).toBe(5)
  expect(declaredItems(new Uint8Array(), "PNG")).toBeUndefined()
})
test("rejects truncated, looping and out-of-bounds directories instead of losing later pages", () => {
  expect(() => declaredItems(new Uint8Array([0]), "ICO")).toThrow("invalid")
  expect(() => declaredItems(new Uint8Array([73, 73, 42, 0]), "TIFF")).toThrow(
    "invalid"
  )
  const loop = tiff(false, true)
  loop.view.setUint32(22, 8, true)
  expect(() => declaredItems(loop.bytes, "TIFF")).toThrow("invalid")
  const truncated = tiff(false, true)
  truncated.view.setUint16(20, 9999, true)
  expect(() => declaredItems(truncated.bytes, "TIFF")).toThrow("invalid")
  for (const at of [4, 6]) {
    const broken = tiff(true, true)
    broken.view.setUint16(at, 1, true)
    expect(() => declaredItems(broken.bytes, "TIFF")).toThrow("invalid")
  }
  const outside = tiff(true, true)
  outside.view.setBigUint64(8, 0xffffffffffffffffn, true)
  expect(() => declaredItems(outside.bytes, "TIFF")).toThrow("invalid")
})
