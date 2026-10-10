// @vitest-environment jsdom
import { expect, test } from "vitest"
import { strToU8, zipSync } from "fflate"
import { documentCount } from "./archive"
import { ConversionError, failure } from "./errors"

const root =
  '<ofd:OFD xmlns:ofd="http://www.ofdspec.org/2016"><ofd:DocBody/><ofd:Other/><ofd:DocBody/></ofd:OFD>'
const zip = (entries: Record<string, string | Uint8Array>) =>
  zipSync(
    Object.fromEntries(
      Object.entries(entries).map(([key, value]) => [
        key,
        typeof value === "string" ? strToU8(value) : value,
      ])
    )
  )

test("counts only direct document bodies, normalizes paths and skips binary assets", () => {
  expect(
    documentCount(
      zip({
        "x/.././OFD.xml": root,
        "assets\\image.png": new Uint8Array([255]),
      })
    )
  ).toBe(2)
})
const invalidHeaders: Record<string, string | Uint8Array>[] = [
  {},
  { "OFD.xml": root, "./OFD.xml": root },
  { "../escape": "", "OFD.xml": root },
  { "OFD.xml": "<OFD>" },
  { "OFD.xml": "<Other><DocBody/></Other>" },
  { "OFD.xml": "<OFD><Nested><DocBody/></Nested></OFD>" },
  { "OFD.xml": "<!DOCTYPE OFD><OFD><DocBody/></OFD>" },
  { "OFD.xml": '<!ENTITY item "test"><OFD><DocBody/></OFD>' },
  { "OFD.xml": new Uint8Array([255, 254, 255]) },
]
test.each(invalidHeaders)(
  "rejects malformed or ambiguous package headers %j",
  (entries) => {
    expect(() => documentCount(zip(entries))).toThrow(Error)
  }
)
test("classifies allocation errors without leaking private engine text", () => {
  const typed = new ConversionError("signature", 2, 3)
  expect(failure(typed)).toBe(typed)
  expect(failure(new RangeError("Invalid array length")).code).toBe("resource")
  expect(failure("private document path")).toMatchObject({
    code: "invalid",
    message: "invalid",
  })
})
