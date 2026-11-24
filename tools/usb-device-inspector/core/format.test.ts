import { expect, test } from "vitest"
import { deniedAccess, usbHex, usbVersion } from "./format"

test("formats USB descriptor values using padded hex and dotted versions", () => {
  expect(usbHex(3)).toBe("0x03")
  expect(usbHex(43981, 4)).toBe("0xABCD")
  expect(usbVersion(3, 2, 1)).toBe("3.2.1")
})

test("distinguishes browser access denial from other errors", () => {
  expect(deniedAccess(new DOMException("revoked", "NotAllowedError"))).toBe(
    true
  )
  expect(deniedAccess(new DOMException("blocked", "SecurityError"))).toBe(true)
  expect(deniedAccess(new DOMException("busy", "NetworkError"))).toBe(false)
  expect(deniedAccess(new Error("driver"))).toBe(false)
})
