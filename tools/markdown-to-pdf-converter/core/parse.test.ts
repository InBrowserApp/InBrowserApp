import { afterEach, expect, test, vi } from "vitest"
import { parse } from "./parse"

afterEach(() => vi.restoreAllMocks())

test("parses UTF-8 and BOM-marked UTF-16 without changing Markdown structure", () => {
  const source =
    "# Café\n\n- [x] Done\n- [ ] Pending\n\n| Name | Value |\n| --- | --- |\n| Unicode | 中文 |\n\n```js\nconst x = 1\n```"
  const utf8 = new TextEncoder().encode(source)
  const little = new Uint8Array(2 + source.length * 2)
  little.set([0xff, 0xfe])
  for (let i = 0; i < source.length; i++)
    new DataView(little.buffer).setUint16(2 + i * 2, source.charCodeAt(i), true)
  const big = Uint8Array.from(little)
  for (let i = 0; i < big.length; i += 2)
    [big[i], big[i + 1]] = [big[i + 1]!, big[i]!]
  const expected = parse(utf8)
  for (const bytes of [little, big]) expect(parse(bytes)).toBe(expected)
  for (const text of [
    "Café",
    'type="checkbox"',
    "checked",
    "<table>",
    "中文",
    "const x = 1",
  ])
    expect(expected).toContain(text)
})
test("rejects invalid encoding and binary content while preserving resource failures", () => {
  expect(() => parse(new Uint8Array([0xff]))).toThrow("encoding")
  expect(() => parse(new Uint8Array([65, 0, 66]))).toThrow("invalid")
  vi.spyOn(TextDecoder.prototype, "decode").mockImplementation(() => {
    throw new RangeError("allocation")
  })
  expect(() => parse(new Uint8Array())).toThrow("allocation")
})
