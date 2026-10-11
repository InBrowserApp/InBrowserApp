import { expect, test } from "vitest"
import { attribute, packagePath, readXml } from "./xml"
const utf8 = new TextEncoder()
test("resolves namespace aliases and decodes UTF-8/UTF-16 documents", () => {
  const source =
    '<a:r xmlns:a="urn:example" a:name="café">text<![CDATA[data]]></a:r>'
  const le = new Uint8Array(Buffer.from("\ufeff" + source, "utf16le"))
  const be = le.slice()
  for (let i = 0; i < be.length; i += 2) {
    be[i] = le[i + 1]!
    be[i + 1] = le[i]!
  }
  for (const bytes of [utf8.encode(source), le, be]) {
    const events: string[] = []
    readXml(
      bytes,
      (tag) => {
        expect(attribute(tag, "urn:example", "name")).toBe("café")
        expect(attribute(tag, "urn:missing", "name")).toBeUndefined()
        events.push("open")
      },
      () => events.push("close"),
      (text) => events.push(text)
    )
    expect(events).toEqual(["open", "text", "data", "close"])
  }
})
test("rejects document type declarations and invalid encodings", () => {
  expect(() =>
    readXml(
      utf8.encode('<!DOCTYPE r [<!ENTITY a "value">]><r>&a;</r>'),
      () => {}
    )
  ).toThrow("unsupported")
  expect(() => readXml(new Uint8Array([255]), () => {})).toThrow(Error)
})
test("resolves encoded filenames and relative package paths", () => {
  expect(packagePath("./Pictures/a%20b.png")).toBe("Pictures/a b.png")
  expect(packagePath("../Pictures/./a.png", "Object/content.xml")).toBe(
    "Pictures/a.png"
  )
  expect(packagePath("a/../b.png")).toBe("b.png")
})
test.each([
  "",
  "/a",
  "https://example.org/a",
  "../a",
  "%2fetc",
  "a%00b",
  "a%3ab",
  "a?x=1",
  "a#id",
  "./",
  "a/..",
  "bad%",
])("rejects an invalid or escaping reference %s", (reference) => {
  expect(() => packagePath(reference)).toThrow(Error)
})
