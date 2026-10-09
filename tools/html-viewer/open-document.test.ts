// @vitest-environment jsdom
import { expect, test, vi } from "vitest"
import { openDocument, failure } from "./open-document"
import m from "./messages/en.json"
const signal = () => new AbortController().signal
const file = (bytes: BlobPart, name = "document.html") =>
  new File([bytes], name)

test("decodes UTF-8, BOMs, declared legacy encodings and an undeclared legacy fallback", async () => {
  expect(
    (await openDocument(file("<h1>日本語</h1>"), signal(), m)).outline[0]?.label
  ).toBe("日本語")
  const cp = new Uint8Array([
    ...Buffer.from('<meta charset="windows-1252"><h1>caf'),
    233,
    ...Buffer.from("</h1>"),
  ])
  expect((await openDocument(file(cp), signal(), m)).outline[0]?.label).toBe(
    "café"
  )
  const unmarked = new Uint8Array([
    ...Buffer.from("<h1>caf"),
    233,
    ...Buffer.from("</h1>"),
  ])
  expect(
    (await openDocument(file(unmarked), signal(), m)).outline[0]?.label
  ).toBe("café")
  for (const encoding of ["utf16le", "utf16be"] as const) {
    let bytes = Buffer.from("<h1>Unicode</h1>", "utf16le")
    if (encoding === "utf16be") bytes = bytes.swap16()
    for (const bom of [true, false]) {
      const data = bom
        ? Buffer.concat([
            Buffer.from(encoding === "utf16le" ? [255, 254] : [254, 255]),
            bytes,
          ])
        : bytes
      expect(
        (await openDocument(file(data), signal(), m)).outline[0]?.label
      ).toBe("Unicode")
    }
  }
  const utf8 = Buffer.concat([
    Buffer.from([239, 187, 191]),
    Buffer.from('<meta charset="unsupported"><h1>BOM wins</h1>'),
  ])
  expect((await openDocument(file(utf8), signal(), m)).outline[0]?.label).toBe(
    "BOM wins"
  )
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>XHTML</title></head><body>Text</body></html>'
  expect(
    (await openDocument(file(xml, "reading.xhtml"), signal(), m)).title
  ).toBe("XHTML")
})

test("reports unsupported encoding, binary content and read failure", async () => {
  await expect(
    openDocument(file('<meta charset="not-an-encoding">'), signal(), m)
  ).rejects.toThrow("ENCODING")
  await expect(
    openDocument(file(new Uint8Array([0, 1, 2, 3])), signal(), m)
  ).rejects.toThrow("INVALID")
  expect(failure(new Error("ENCODING"))).toBe("encoding")
  expect(failure(new RangeError("allocation failed"))).toBe("resourceLimit")
  expect(failure(new Error("out of memory"))).toBe("resourceLimit")
  expect(failure("unknown")).toBe("invalid")
  const read = vi
    .spyOn(FileReader.prototype, "readAsArrayBuffer")
    .mockImplementation(function (this: FileReader) {
      this.dispatchEvent(new Event("error"))
    })
  await expect(openDocument(file("text"), signal(), m)).rejects.toBeNull()
  read.mockRestore()
})

test("cancels file reads and rejects already canceled operations", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(
    openDocument(file("text"), controller.signal, m)
  ).rejects.toThrow(/abort/i)
  const pending = new AbortController()
  const read = vi
    .spyOn(FileReader.prototype, "readAsArrayBuffer")
    .mockImplementation(() => {})
  const opened = openDocument(file("text"), pending.signal, m)
  pending.abort()
  await expect(opened).rejects.toThrow(/abort/i)
  read.mockRestore()
})
