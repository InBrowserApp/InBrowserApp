import { expect, test } from "vitest"
import { maximumPageZoom, isDocumentLimitError } from "./index"

test("caps page dimensions and area while allowing useful zoom", () => {
  expect(maximumPageZoom(816, 1056)).toBe(4)
  expect(maximumPageZoom(2000, 2000)).toBe(2)
  expect(maximumPageZoom(10000, 10)).toBe(8192 / 10000)
  for (const size of [0, -1, Infinity, NaN, 1e10])
    expect(() => maximumPageZoom(size, 100)).toThrow("TOO_LARGE")
})
test("recognizes resource errors without relying on private parser messages", () => {
  expect(isDocumentLimitError(new Error("TOO_LARGE"))).toBe(true)
  for (const code of ["ooxml-resource-limit", "ooxml-decoded-image-limit"])
    expect(isDocumentLimitError(Object.assign(new Error(), { code }))).toBe(
      true
    )
  for (const error of [
    null,
    "TOO_LARGE",
    new Error("invalid"),
    Object.assign(new Error(), { code: "encrypted" }),
  ])
    expect(isDocumentLimitError(error)).toBe(false)
})

test("accepts only the expected ZIP container entries without inflating contents", async () => {
  const { zipSync, strToU8 } = await import("fflate")
  const { assertOfficeArchive } = await import("./index")
  const archive = (main: string) =>
    Uint8Array.from(
      zipSync({
        "[Content_Types].xml": strToU8("<Types/>"),
        [main]: strToU8("contents are parsed by the format engine"),
      })
    ).buffer
  expect(() =>
    assertOfficeArchive(archive("ppt/presentation.xml"), "pptx")
  ).not.toThrow()
  expect(() =>
    assertOfficeArchive(archive("word/document.xml"), "docx")
  ).not.toThrow()
  expect(() =>
    assertOfficeArchive(archive("xl/workbook.xml"), "xlsx")
  ).not.toThrow()
  expect(() =>
    assertOfficeArchive(archive("word/document.xml"), "pptx")
  ).toThrow("INVALID")
  for (const bytes of [[], [80], [80, 75], [80, 75, 3], [80, 75, 3, 5]])
    expect(() =>
      assertOfficeArchive(new Uint8Array(bytes).buffer, "pptx")
    ).toThrow("INVALID")
  expect(() =>
    assertOfficeArchive(new Uint8Array([80, 75, 3, 4]).buffer, "pptx")
  ).toThrow("invalid zip data")
})

test("rejects over-budget ZIP directory sizes before allocating decoded contents", async () => {
  const { zipSync } = await import("fflate")
  const { assertOfficeArchive } = await import("./index")
  const bytes = Uint8Array.from(
    zipSync({
      "[Content_Types].xml": new Uint8Array(),
      "ppt/presentation.xml": new Uint8Array(),
    })
  )
  const view = new DataView(bytes.buffer)
  for (let offset = 0; offset < bytes.length - 4; offset++) {
    if (view.getUint32(offset, true) === 0x02014b50) {
      view.setUint32(offset + 24, 33 * 1024 * 1024, true)
      break
    }
  }
  expect(() => assertOfficeArchive(bytes.buffer, "pptx")).toThrow("TOO_LARGE")
  const entries = Object.fromEntries(
    Array.from({ length: 10001 }, (_, i) => [String(i), new Uint8Array()])
  )
  expect(() =>
    assertOfficeArchive(Uint8Array.from(zipSync(entries)).buffer, "pptx")
  ).toThrow("TOO_LARGE")
})
