import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { preflight } from "./preflight"

const input = (body: string) => new TextEncoder().encode(body).buffer
const rtf = (body: string) => input(`{\\rtf1\\ansi ${body}}`)
const field = (instruction: string) =>
  `{\\field{\\*\\fldinst ${instruction}}{\\fldrslt Result}}`

test.each([
  "reading.rtf",
  "river-survey.rtf",
  "river-survey-pandoc.rtf",
  "windows-1251.rtf",
  "page-styles.rtf",
])("accepts original RTF producer fixture %s", (name) => {
  const bytes = Uint8Array.from(
    readFileSync(`tools/rtf-to-pdf-converter/fixtures/${name}`)
  )
  const result = preflight(bytes.buffer)
  if (["reading.rtf", "page-styles.rtf"].includes(name))
    expect(result.images.length).toBeGreaterThan(0)
  else expect(result.images).toEqual([])
})
test.each([
  "",
  "not RTF",
  "{\\rtf2 text}",
  "{\\rtf1",
  "{\\rtf1 text}}",
  "{\\rtf1 text}extra",
  "{\\rtf1 text}{}",
  "{\\rtf1 \\",
  "{\\rtf1 \\'xz}",
  "{\\rtf1 \\'a}",
  "{\\rtf1 \\fs- x}",
  "{\\rtf1 \\fs9007199254740992}",
  "{\\rtf1 \\bin-1 x}",
  "{\\rtf1 \\bin x}",
  "{\\rtf1 \\bin50 abc}",
])("rejects malformed input %s", (text) => {
  expect(() => preflight(input(text))).toThrow("invalid")
})
test("keeps binary contents and escaped punctuation separate from RTF structure", () => {
  expect(
    preflight(
      input(
        " \r\n{\\rtf1 {\\*\\unknown \\bin4 }{\\x}Literal \\{ \\} \\\\ \\'7b \\~ \\- \\_ \\*\\bin0 }\r\n\0"
      )
    )
  ).toEqual({ images: [] })
})
test("rejects an otherwise readable document truncated before its closing group", () => {
  expect(() => preflight(input("{\\rtf1 visible text"))).toThrow("invalid")
})
test.each([
  "object",
  "objdata",
  "objlink",
  "objautlink",
  "filetbl",
  "fontemb",
  "fontfile",
])("rejects unsupported destination %s", (word) => {
  expect(() => preflight(rtf(`{\\${word} data}`))).toThrow("unsupported")
})
test.each([
  "PAGE",
  "NUMPAGES \\* MERGEFORMAT",
  "REF bookmark",
  "PAGEREF bookmark",
  "TOC",
  "FORMTEXT",
  "FORMCHECKBOX",
  "FORMDROPDOWN",
  'HYPERLINK "https://example.org/"',
  'HYPERLINK "mailto:a@example.org"',
  'HYPERLINK \\\\l "section"',
])("accepts static field %s", (instruction) => {
  expect(preflight(rtf(field(instruction)))).toEqual({ images: [] })
})
test.each([
  "",
  "PAGE123",
  "INCLUDEPICTURE https://example.org/image.png",
  "INCLUDETEXT other.rtf",
  "DDE application",
  "LINK source",
  'HYPERLINK "javascript:alert(1)"',
  'HYPERLINK "file:///tmp/private"',
  'HYPERLINK "data:text/html,payload"',
  'HYPERLINK "https://example.org/file:payload"',
  "\\u73?NCLUDEPICTURE external",
  "\\uc0\\u73NCLUDEPICTURE external",
  "\\'49NCLUDEPICTURE external",
  "\\bin1 x",
])("rejects unsafe or unsupported field %s", (instruction) => {
  expect(() => preflight(rtf(field(instruction)))).toThrow("unsupported")
})
test("decodes Unicode and nested formatting for supported field instructions", () => {
  expect(preflight(rtf(field("PA\r\nGE")))).toEqual({ images: [] })
  expect(preflight(rtf(field("{\\b \\u80?}A\\'47E\\par\\tab\\line ")))).toEqual(
    { images: [] }
  )
})
test.each(["\\uc", "\\uc-1", "\\u", "\\u-32769", "\\u65536"])(
  "rejects malformed Unicode field controls %s",
  (text) => {
    expect(() => preflight(rtf(field(text)))).toThrow("invalid")
    expect(() => preflight(rtf(text))).toThrow("invalid")
  }
)
test.each(["wmetafile8", "emfblip", "macpict", "dibitmap0", "wbitmap0", ""])(
  "rejects unsupported picture %s",
  (format) => {
    expect(() => preflight(rtf(`{\\pict\\${format} 0000}`))).toThrow(
      "unsupported"
    )
  }
)
test.each(["00", "89504e470d0a1a0", "89504e47xy", "8950\\'4e47", "8\\bin1 x"])(
  "rejects bad picture payload %s",
  (picture) => {
    expect(() => preflight(rtf(`{\\pict\\pngblip ${picture}}`))).toThrow(
      /invalid|unsupported/
    )
  }
)
test("collects hexadecimal and binary PNG/JPEG payloads with metadata groups excluded", async () => {
  const png = preflight(
    rtf(
      "{\\pict\\pngblip {\\*\\blipuid deadbeef} 89 50\n4E47\\picw10 0d0A1a0a}"
    )
  )
  expect(png.images[0]!.type).toBe("image/png")
  expect(new Uint8Array(await png.images[0]!.arrayBuffer())).toEqual(
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
  )
  const header = new TextEncoder().encode("{\\rtf1{\\pict\\jpegblip\\bin3 ")
  const data = new Uint8Array([...header, 255, 216, 255, 125, 125])
  const jpeg = preflight(data.buffer)
  expect(jpeg.images[0]!.type).toBe("image/jpeg")
  expect(new Uint8Array(await jpeg.images[0]!.arrayBuffer())).toEqual(
    new Uint8Array([255, 216, 255])
  )
})
