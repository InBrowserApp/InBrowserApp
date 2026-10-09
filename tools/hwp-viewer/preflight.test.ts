import { expect, test } from "vitest"
import * as CFB from "cfb"
import { strToU8, zipSync } from "fflate"
import { preflight } from "./preflight"
function binary(flags = 0, version = 5, length = 256, valid = true) {
  const header = new Uint8Array(256)
  header.set(strToU8(valid ? "HWP Document File" : "Other Document"))
  header[35] = version
  new DataView(header.buffer).setUint32(36, flags, true)
  const container = CFB.utils.cfb_new()
  CFB.utils.cfb_add(container, "FileHeader", header.subarray(0, length))
  return new Uint8Array(CFB.write(container, { type: "array" }))
}
function xml(manifest?: string, mime = "application/hwp+zip", content = true) {
  return zipSync({
    mimetype: strToU8(mime),
    ...(content ? { "Contents/content.hpf": strToU8("<package/>") } : {}),
    ...(manifest === undefined
      ? {}
      : { "META-INF/manifest.xml": strToU8(manifest) }),
  })
}
test("accepts ordinary HWP5, editing restrictions, and valid HWPX containers", () => {
  expect(() => preflight(binary())).not.toThrow()
  expect(() => preflight(binary(0x200))).not.toThrow()
  expect(() => preflight(binary(0x80))).not.toThrow()
  preflight(xml())
  preflight(
    xml(
      '<m:manifest xmlns:m="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"/>'
    )
  )
})
test.each([2, 16, 256, 1024])(
  "distinguishes opening protection flag %i",
  (flag) => {
    expect(() => preflight(binary(flag))).toThrow("protected")
  }
)
test("distinguishes distribution-only files and historical versions", () => {
  expect(() => preflight(binary(4))).toThrow("distribution")
  expect(() => preflight(binary(0, 4))).toThrow("legacy")
  expect(() => preflight(strToU8("HWP Document File V3.00"))).toThrow("legacy")
})
test("rejects missing and malformed compound headers", () => {
  expect(() => preflight(binary(0, 5, 40))).toThrow("invalid")
  expect(() => preflight(binary(0, 5, 256, false))).toThrow("invalid")
  expect(() =>
    preflight(new Uint8Array(CFB.write(CFB.utils.cfb_new(), { type: "array" })))
  ).toThrow("invalid")
  expect(() => preflight(strToU8("garbage"))).toThrow("invalid")
})
test("detects namespaced HWPX encryption without accepting namespace spoofing", () => {
  expect(() =>
    preflight(
      xml(
        '<x:manifest xmlns:x="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"><x:encryption-data/></x:manifest>'
      )
    )
  ).toThrow("protected")
  preflight(
    xml(
      '<x:manifest xmlns:x="https://example.invalid"><x:encryption-data/></x:manifest>'
    )
  )
})
test("rejects disguised archives, missing content, malformed metadata and DTDs", () => {
  expect(() => preflight(xml(undefined, "application/zip"))).toThrow("invalid")
  expect(() => preflight(xml(undefined, "application/hwp+zip", false))).toThrow(
    "invalid"
  )
  expect(() => preflight(zipSync({}))).toThrow("invalid")
  expect(() => preflight(xml("<broken>"))).toThrow(/unclosed tag/)
  expect(() => preflight(xml('<!DOCTYPE m [<!ENTITY e "test">]><m/>'))).toThrow(
    "invalid"
  )
})
