import { expect, test } from "vitest"
import { displayValue, requestedServices } from "./data"

test("combines common and custom UUIDs without repeating short UUIDs", () => {
  const common = requestedServices("")
  expect(common).toContain(0x180f)
  expect(requestedServices("180f, 0x180F")).toEqual(common)
  expect(
    requestedServices("FAB0, CAA00000-0000-0000-0000-000000000001")
  ).toEqual([...common!, 0xfab0, "caa00000-0000-0000-0000-000000000001"])
  expect(requestedServices(" 180f invalid ")).toBeNull()
})

test("decodes just the bytes visible through a DataView", () => {
  const bytes = Uint8Array.of(7, 0xc3, 0xa9, 255)
  expect(displayValue(new DataView(bytes.buffer, 1, 2))).toEqual({
    hex: "C3 A9",
    text: "é",
  })
  expect(displayValue(new DataView(bytes.buffer, 0, 0))).toEqual({
    hex: "",
    text: "",
  })
})
