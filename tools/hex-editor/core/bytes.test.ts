import { expect, test } from "vitest"
import { ascii, hex, pageStart, parseOffset, patchedFile } from "./bytes"

test("formats bytes and sanitizes non-printable ASCII", () => {
  expect(hex(10)).toBe("0A")
  expect(hex(256, 8)).toBe("00000100")
  expect([31, 32, 65, 126, 127, 255].map(ascii)).toEqual([
    ".",
    " ",
    "A",
    "~",
    ".",
    ".",
  ])
})

test("parses the same hexadecimal notation displayed in the grid", () => {
  expect(parseOffset(" 0x1a ", 27)).toBe(26)
  expect(parseOffset("1A", 27)).toBe(26)
  expect(parseOffset("0", 1)).toBe(0)
  for (const value of ["", "0x", "-1", "12g", "1e+2", "1B", "F".repeat(300)]) {
    expect(parseOffset(value, 27)).toBeNull()
  }
  expect(parseOffset("0", 0)).toBeNull()
  expect([0, 255, 256, 511, 512].map(pageStart)).toEqual([0, 0, 256, 256, 512])
})

test("merges sparse edits with original bytes across page boundaries", async () => {
  const original = Uint8Array.from({ length: 514 }, (_, index) => index % 256)
  const file = new File([original], "bytes.bin", {
    type: "application/octet-stream",
  })
  const edits = new Map([
    [513, 7],
    [256, 34],
    [0, 12],
    [255, 56],
    [400, 0],
  ])
  const expected = original.slice()
  for (const [offset, value] of edits) expected[offset] = value

  const result = patchedFile(file, edits)
  expect(result.type).toBe(file.type)
  expect(result.size).toBe(file.size)
  expect(new Uint8Array(await result.arrayBuffer())).toEqual(expected)
  expect(new Uint8Array(await file.arrayBuffer())).toEqual(original)
  expect(
    new Uint8Array(await patchedFile(file, new Map()).arrayBuffer())
  ).toEqual(original)
})
