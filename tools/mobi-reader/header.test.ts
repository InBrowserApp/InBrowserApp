import { File } from "node:buffer"
import { expect, test } from "vitest"
import { checkHeader } from "./header"

function book(change?: (view: DataView, bytes: Uint8Array) => void) {
  const bytes = new Uint8Array(500)
  const view = new DataView(bytes.buffer)
  bytes.set(new TextEncoder().encode("BOOKMOBI"), 60)
  view.setUint16(76, 2)
  view.setUint32(78, 100)
  view.setUint32(86, 480)
  view.setUint16(100, 2)
  view.setUint16(108, 1)
  bytes.set(new TextEncoder().encode("MOBI"), 116)
  view.setUint32(120, 232)
  view.setUint32(128, 65001)
  view.setUint32(136, 6)
  change?.(view, bytes)
  return new File([bytes], "sample.mobi") as globalThis.File
}
const check = (file: globalThis.File) =>
  checkHeader(file, new AbortController().signal)
function exth(
  view: DataView,
  bytes: Uint8Array,
  type: number,
  value: number | string
) {
  view.setUint32(228, 64)
  bytes.set(new TextEncoder().encode("EXTH"), 348)
  view.setUint32(352, 24)
  view.setUint32(356, 1)
  view.setUint32(360, type)
  view.setUint32(364, 12)
  if (typeof value === "number") view.setUint32(368, value)
  else bytes.set(new TextEncoder().encode(value), 368)
}

test("accepts supported MOBI header versions and compression without arbitrary size limits", async () => {
  for (const version of [6, 7, 8])
    for (const compression of [1, 2, 17480])
      await expect(
        check(
          book((v) => {
            v.setUint32(136, version)
            v.setUint16(100, compression)
          })
        )
      ).resolves.toBeUndefined()
  await expect(
    check(book((v, b) => exth(v, b, 121, 0xffffffff)))
  ).resolves.toBeUndefined()
})

test.each([
  (v: DataView) => v.setUint16(76, 0),
  (v: DataView) => v.setUint16(76, 100),
  (v: DataView) => v.setUint32(78, 70),
  (v: DataView) => v.setUint32(86, 99),
  (v: DataView) => v.setUint32(86, 500),
  (v: DataView) => v.setUint32(78, 300),
  (v: DataView) => v.setUint32(120, 231),
  (v: DataView) => v.setUint32(120, 500),
  (v: DataView) => v.setUint16(108, 2),
])("rejects malformed record directories and headers (%#)", async (change) => {
  await expect(check(book(change))).rejects.toThrow("invalid")
})

test("distinguishes protected, empty, unrelated and unsupported books", async () => {
  await expect(
    check(new File(["short"], "x.mobi") as globalThis.File)
  ).rejects.toThrow("invalid")
  await expect(check(book((v) => v.setUint16(112, 2)))).rejects.toThrow(
    "protected"
  )
  await expect(check(book((v) => v.setUint16(108, 0)))).rejects.toThrow("empty")
  for (const change of [
    (v: DataView) => v.setUint32(60, 0),
    (v: DataView) => v.setUint32(116, 0),
    (v: DataView) => v.setUint32(136, 9),
    (v: DataView) => v.setUint16(100, 99),
    (v: DataView) => v.setUint32(128, 99),
  ])
    await expect(check(book(change))).rejects.toThrow("unsupportedVariant")
})

test("bounds EXTH records and detects fixed layout and invalid combo boundaries", async () => {
  await expect(check(book((v, b) => exth(v, b, 122, "true")))).rejects.toThrow(
    "unsupportedLayout"
  )
  await expect(check(book((v, b) => exth(v, b, 121, 10)))).rejects.toThrow(
    "invalid"
  )
  await expect(
    check(book((v, b) => exth(v, b, 999, 0)))
  ).resolves.toBeUndefined()
  for (const change of [
    (v: DataView) => v.setUint32(348, 0),
    (v: DataView) => v.setUint32(352, 500),
    (v: DataView) => v.setUint32(352, 4),
    (v: DataView) => v.setUint32(356, 2),
    (v: DataView) => v.setUint32(364, 7),
    (v: DataView) => v.setUint32(364, 500),
    (v: DataView) => v.setUint32(364, 9),
    (v: DataView) => v.setUint32(120, 360),
  ])
    await expect(
      check(
        book((v, b) => {
          exth(v, b, 121, 0xffffffff)
          change(v)
        })
      )
    ).rejects.toThrow("invalid")
})
