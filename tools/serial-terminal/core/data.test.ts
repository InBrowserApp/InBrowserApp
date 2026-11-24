import { expect, test } from "vitest"

import { encodeSend, formatLog } from "./data"

test("encodes UTF-8 with an optional line ending", () => {
  expect(encodeSend("é", "text", "crlf")).toEqual(
    Uint8Array.of(0xc3, 0xa9, 13, 10)
  )
  expect(encodeSend("x", "text", "none")).toEqual(Uint8Array.of(120))
})

test("encodes contiguous or whitespace-separated hex without a line ending", () => {
  expect(encodeSend("00 7F\naFff", "hex", "crlf")).toEqual(
    Uint8Array.of(0, 127, 175, 255)
  )
  for (const invalid of ["", " ", "A", "0x00", "XZ"]) {
    expect(encodeSend(invalid, "hex", "none")).toBeNull()
  }
})

test("exports timestamped text or hex in session order", () => {
  const time = new Date("2026-11-24T14:22:01.016Z")
  const entries = [
    {
      id: 0,
      time,
      direction: "RX" as const,
      text: "x",
      bytes: Uint8Array.of(120),
    },
    {
      id: 1,
      time,
      direction: "TX" as const,
      text: "y",
      bytes: Uint8Array.of(121),
    },
  ]
  expect(formatLog(entries, "text")).toBe(
    "2026-11-24T14:22:01.016Z RX x\n2026-11-24T14:22:01.016Z TX y"
  )
  expect(formatLog(entries, "hex")).toBe(
    "2026-11-24T14:22:01.016Z RX 78\n2026-11-24T14:22:01.016Z TX 79"
  )
})
