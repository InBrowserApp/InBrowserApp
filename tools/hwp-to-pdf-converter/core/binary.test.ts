// @vitest-environment node
import * as CFB from "cfb"
import { deflateSync } from "fflate"
import { expect, test } from "vitest"
import { binaryResources } from "./binary"
function record(tag: number, bytes: number[], extended = false) {
  const data = new Uint8Array((extended ? 8 : 4) + bytes.length)
  const view = new DataView(data.buffer)
  view.setUint32(0, tag | ((extended ? 0xfff : bytes.length) << 20), true)
  if (extended) view.setUint32(4, bytes.length, true)
  data.set(bytes, extended ? 8 : 4)
  return data
}
function doc({
  info = record(16, [1, 0]),
  body = record(66, [0]),
  compressed = false,
  image,
  header = true,
}: {
  info?: Uint8Array
  body?: Uint8Array | null
  compressed?: boolean
  image?: Uint8Array
  header?: boolean
} = {}) {
  const cfb = CFB.utils.cfb_new()
  if (header) {
    const bytes = new Uint8Array(256)
    bytes[36] = compressed ? 1 : 0
    CFB.utils.cfb_add(cfb, "FileHeader", bytes)
  }
  CFB.utils.cfb_add(cfb, "DocInfo", compressed ? deflateSync(info) : info)
  if (body)
    CFB.utils.cfb_add(
      cfb,
      "BodyText/Section0",
      compressed ? deflateSync(body) : body
    )
  if (image) CFB.utils.cfb_add(cfb, "BinData/BIN0001.png", image)
  return CFB.write(cfb, { type: "buffer" })
}
const bin = (attr: number) =>
  record(18, [attr, 0, 1, 0, 3, 0, 112, 0, 110, 0, 103, 0])
const info = (entry: Uint8Array) =>
  new Uint8Array([...record(16, [1, 0]), ...entry])
test("accepts compressed and extended binary record containers", () => {
  expect(
    binaryResources(doc({ compressed: true, body: record(66, [0], true) }))
  ).toEqual([])
})
test.each([0, 16, 32])("reads BinData compression mode %i", (attr) => {
  const compressed = attr === 0
  const png = new Uint8Array([1, 2, 3])
  const images = binaryResources(
    doc({
      compressed,
      info: info(bin(attr | 1)),
      image: compressed || attr === 16 ? deflateSync(png) : png,
    })
  )
  expect(images[0]!.bytes).toEqual(png)
})
test.each([
  { header: false },
  { info: new Uint8Array() },
  { info: record(16, [0]) },
  { info: record(16, [0, 0]) },
  { info: record(17, [0]) },
  { body: null },
  { body: new Uint8Array() },
  { body: new Uint8Array(), compressed: true },
  { body: new Uint8Array([1, 2]) },
  { body: new Uint8Array([0, 0, 240, 255]) },
  { body: new Uint8Array([0, 0, 240, 255, 10, 0, 0, 0]) },
])("rejects truncated binary structure %j", (value) => {
  expect(() => binaryResources(doc(value))).toThrow("invalid")
})
test.each([
  record(18, [0]),
  bin(0),
  bin(2),
  record(18, [1, 0, 1, 0, 0, 0]),
  record(18, [1, 0, 1, 0, 10, 0]),
])("rejects unsupported/malformed BinData", (entry) => {
  expect(() => binaryResources(doc({ info: info(entry) }))).toThrow(
    "unsupported"
  )
})
test("rejects missing image streams", () => {
  expect(() => binaryResources(doc({ info: info(bin(1)) }))).toThrow("invalid")
})

test("rejects truncated and undeclared picture references but allows unassigned placeholders", () => {
  expect(() => binaryResources(doc({ body: record(85, [1]) }))).toThrow(
    "unsupported"
  )
  const picture = Array.from({ length: 73 }, () => 0)
  expect(binaryResources(doc({ body: record(85, picture) }))).toEqual([])
  picture[71] = 1
  expect(() => binaryResources(doc({ body: record(85, picture) }))).toThrow(
    "unsupported"
  )
})
