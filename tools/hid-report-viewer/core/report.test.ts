import { expect, test } from "vitest"
import { hex, readReport } from "./report"

test("formats report bytes and device identifiers in padded hex", () => {
  expect(hex(10)).toBe("0A")
  expect(hex(1725, 4)).toBe("06BD")
})

test("copies the payload view and compares offsets against the previous report", () => {
  const buffer = Uint8Array.of(255, 3, 9, 15, 255)
  const data = new DataView(buffer.buffer, 1, 3)
  expect(readReport(data).changed).toEqual([false, false, false])
  const compared = readReport(data, Uint8Array.of(3, 22))
  expect(compared.changed).toEqual([false, true, true])
  buffer[1] = 12
  expect(compared.bytes).toEqual(Uint8Array.of(3, 9, 15))
  expect(readReport(new DataView(buffer.buffer, 1, 0)).bytes).toHaveLength(0)
})
