// @vitest-environment node
import { strToU8, zipSync } from "fflate"
import { expect, test } from "vitest"
import { xmlResources } from "./xml"
function archive(
  items: string,
  spine = '<o:itemref idref="section"/>',
  section = "<s/>",
  extra: Record<string, Uint8Array> = {}
) {
  return zipSync({
    "Contents/content.hpf": strToU8(
      `<o:package xmlns:o="http://www.idpf.org/2007/opf/"><o:manifest>${items}</o:manifest><o:spine>${spine}</o:spine></o:package>`
    ),
    "Contents/section.xml": strToU8(section),
    ...extra,
  })
}
const section =
  '<o:item id="section" href="section.xml" media-type="application/xml"/>'
test("accepts relative manifest paths and unrelated namespaces/attributes", () => {
  expect(
    xmlResources(
      archive(
        section + '<other xmlns="urn:test"/>',
        '<o:itemref idref="section"/>',
        '<s id="1" binaryItemIDRef="0"><a binaryItemIDRef=""/><b binaryItemIDRef="section"/></s>'
      )
    )
  ).toEqual([])
})
test("ignores non-rendered metadata entries outside BinData", () => {
  expect(
    xmlResources(
      archive(
        section + '<o:item id="meta" href="info.dat"/>',
        undefined,
        undefined,
        { "info.dat": strToU8("metadata") }
      )
    )
  ).toEqual([])
})
test.each([
  '<o:item href="section.xml"/>',
  section + section,
  '<o:item id="section"/>',
  '<o:item id="section" href="https://example.invalid/image"/>',
  '<o:item id="section" href="missing.xml"/>',
  '<o:item id="section" href="section.xml" isEmbeded="0"/>',
])("rejects invalid/missing/external manifest entries", (items) => {
  expect(() => xmlResources(archive(items))).toThrow("unsupported")
})
test.each(["", "<o:itemref/>", '<o:itemref idref="missing"/>'])(
  "rejects missing spine %s",
  (spine) => {
    expect(() => xmlResources(archive(section, spine))).toThrow("invalid")
  }
)
test("rejects packages without a content manifest", () => {
  expect(() => xmlResources(zipSync({}))).toThrow("invalid")
})
test("does not expand document type entities", () => {
  expect(() =>
    xmlResources(archive(section, undefined, "<!DOCTYPE s><s/>"))
  ).toThrow("invalid")
})
test("recognizes image resources by media type and BinData path", () => {
  const images = xmlResources(
    archive(
      section +
        '<o:item id="image" href="i.png" media-type="image/png"/><o:item id="image2" href="BinData/a.png"/>',
      undefined,
      undefined,
      { "i.png": new Uint8Array([1]), "BinData/a.png": new Uint8Array([2]) }
    )
  )
  expect(images.map((x) => x.bytes[0])).toEqual([1, 2])
})
