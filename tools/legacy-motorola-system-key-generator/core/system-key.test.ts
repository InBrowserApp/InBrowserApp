import { createHash } from "node:crypto"
import { describe, expect, test } from "vitest"

import { createLegacySystemKey, normalizeSystemId } from "./system-key"

describe("legacy Motorola system keys", () => {
  test.each([
    ["0", "0000"],
    ["abc", "0ABC"],
    [" \t1a2b\n", "1A2B"],
    ["FFFF", "FFFF"],
  ])("normalizes %j to %s", (input, expected) => {
    expect(normalizeSystemId(input)).toBe(expected)
    expect(createLegacySystemKey(input).systemId).toBe(expected)
    expect(createLegacySystemKey(input).filename).toBe(`SYS0${expected}.KEY`)
  })

  test.each([
    "",
    " \t\n",
    "12345",
    "0x12",
    "12 34",
    "12\n34",
    "-123",
    "+123",
    "12.3",
    "12G4",
    "１２３４",
    "😀",
  ])("rejects %j without truncating or removing characters", (input) => {
    expect(normalizeSystemId(input)).toBeNull()
    expect(() => createLegacySystemKey(input)).toThrow(
      "Invalid legacy System ID"
    )
  })

  // Reference bytes from syskey-batlab revision
  // 19735068671aee0ec9ca845a5ebe210d59a90e4c, not a claim of CPS compatibility.
  test.each([
    ["0000", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A1AFFA1"],
    ["1234", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A08FF95"],
    ["FFFF", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A1BFF5E"],
    ["1A2B", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A00FF8A"],
    ["0B6F", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A0FFF6E"],
    ["3D6F", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A5CFF6E"],
    ["3E6F", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A5CFF6E"],
    ["4D6F", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A4CFF6E"],
    ["5D6F", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241ABCFF6E"],
    ["0060", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A1AFF61"],
    ["00C0", "2CB532B3880D6ADF4BB4E9952C6D1C0337241F5B93BF241A1AFF61"],
  ])("matches the reference bytes for %s", (input, expected) => {
    const { bytes } = createLegacySystemKey(input)
    expect(bytes).toHaveLength(27)
    expect(Buffer.from(bytes).toString("hex").toUpperCase()).toBe(expected)
  })

  test("matches the reference corpus for all 65,536 System IDs", () => {
    // SHA-256 of all 27-byte reference outputs concatenated in ascending
    // 0000–FFFF order, computed independently from the pinned Rust tables.
    const hash = createHash("sha256")
    for (let id = 0; id <= 0xffff; id++) {
      hash.update(createLegacySystemKey(id.toString(16)).bytes)
    }
    expect(hash.digest("hex")).toBe(
      "d3def4ba58a9476c3cbfefe0f664041ebaa19c9970c48aaacd83f9c9855836a1"
    )
  })

  test("returns independent binary buffers", () => {
    const first = createLegacySystemKey("1234")
    first.bytes.fill(0)
    expect(createLegacySystemKey("1234").bytes[0]).toBe(0x2c)
  })
})
