import { readFileSync } from "node:fs"
import { beforeEach, expect, test, vi } from "vitest"
import { parseMsDoc } from "@file-viewer/doc"
import { find, read, write, utils } from "cfb"
import { parseDocument } from "./parse"
import { failure } from "./errors"

vi.mock("@file-viewer/doc", async (original) => {
  const actual = await original<typeof import("@file-viewer/doc")>()
  return { ...actual, parseMsDoc: vi.fn(actual.parseMsDoc) }
})
const source = Uint8Array.from(
  readFileSync("tools/doc-to-pdf-converter/fixtures/report.doc")
).buffer
const original = parseMsDoc(source)
beforeEach(() =>
  vi.mocked(parseMsDoc).mockReturnValue(structuredClone(original))
)

function changeWord(change: (word: DataView) => void) {
  const cfb = read(new Uint8Array(source), { type: "array" })
  const entry = find(cfb, "/WordDocument")!
  const word = Uint8Array.from(entry.content)
  change(new DataView(word.buffer))
  entry.content = word
  return Uint8Array.from(write(cfb, { type: "array" }) as Uint8Array).buffer
}

test("exports the original report body, image and complete table with page breaks", () => {
  const result = parseDocument(source, "report.doc")
  expect(result.html).toContain("Final paragraph 8")
  expect(result.html).toContain("Row 80 has readable text")
  expect(result.html).toContain("中文测试")
  expect(result.html).toContain("data:image/png;base64,")
  expect(result.html).toContain("break-before:page")
  expect(parseMsDoc).toHaveBeenLastCalledWith(source, {
    maxPictureBytes: source.byteLength,
  })
})

test.each([4, 5, 6, 7, 8, 9, 10])("rejects omitted story %s", (index) => {
  const buffer = changeWord((word) => {
    const offset = 34 + word.getUint16(32, true) * 2
    word.setUint32(offset + 2 + index * 4, 10, true)
  })
  expect(() => parseDocument(buffer, "notes.doc")).toThrow("unsupported")
})
test.each([40, 41])("rejects floating drawing table %s", (index) => {
  const buffer = changeWord((word) => {
    const longs = 34 + word.getUint16(32, true) * 2
    const pairs = longs + 2 + word.getUint16(longs, true) * 4
    word.setUint32(pairs + 2 + index * 8 + 4, 10, true)
  })
  expect(() => parseDocument(buffer, "shape.doc")).toThrow("unsupported")
})
test("rejects malformed extended metadata and HTML-in-OLE", () => {
  for (const field of ["longs", "pairs"]) {
    const buffer = changeWord((word) => {
      const longs = 34 + word.getUint16(32, true) * 2
      if (field === "longs") word.setUint16(longs, 3, true)
      else
        word.setUint16(longs + 2 + word.getUint16(longs, true) * 4, 65535, true)
    })
    expect(() => parseDocument(buffer, "bad.doc")).toThrow("invalid")
  }
  const cfb = utils.cfb_new()
  utils.cfb_add(
    cfb,
    "WordDocument",
    new TextEncoder().encode("<html><body>Text</body></html>")
  )
  const html = Uint8Array.from(
    write(cfb, { type: "array" }) as Uint8Array
  ).buffer
  expect(() => parseDocument(html, "source.wps")).toThrow("unsupported")
})

test.each([
  { type: "attachment" },
  { displayable: false },
  { meta: undefined },
  { meta: { sourceKind: "linked" } },
  { mime: "image/svg+xml" },
])("rejects incomplete or unsupported assets %j", (asset) => {
  const parsed = structuredClone(original)
  Object.assign(parsed.assets[0]!, asset)
  vi.mocked(parseMsDoc).mockReturnValue(parsed)
  expect(() => parseDocument(source, "source.doc")).toThrow("unsupported")
})
test.each([
  { listId: 1 },
  { listId: undefined, frameWidth: 20 },
  { frameHeight: 20 },
  { frameLeft: 20 },
  { frameTop: 20 },
])("rejects automatic lists and positioned paragraphs %j", (state) => {
  const parsed = structuredClone(original)
  const paragraph = parsed.blocks.find((block) => block.type === "paragraph")!
  Object.assign(paragraph.paraState, state)
  vi.mocked(parseMsDoc).mockReturnValue(parsed)
  expect(() => parseDocument(source, "source.doc")).toThrow("unsupported")
})
test("rejects warnings, inline attachments, nested tables and attachment sections", () => {
  for (const kind of ["warning", "inline", "table", "attachment"]) {
    const parsed = structuredClone(original)
    if (kind === "warning") parsed.warnings.push({ message: "content omitted" })
    if (kind === "inline") {
      const paragraph = parsed.blocks.find(
        (block) => block.type === "paragraph"
      )!
      paragraph.inlines.push({ type: "attachment" } as never)
    }
    if (kind === "table")
      parsed.blocks.find((block) => block.type === "table")!.depth = 2
    if (kind === "attachment")
      parsed.blocks.push({ type: "attachments" } as never)
    vi.mocked(parseMsDoc).mockReturnValue(parsed)
    expect(() => parseDocument(source, "source.doc")).toThrow("unsupported")
  }
})
test.each([
  "invalid",
  "unsupported",
  "protected",
  "resource",
  "engineUnavailable",
])("preserves public error %s", (code) => {
  expect(failure(new Error(code)).code).toBe(code)
})
test("sanitizes internal errors and retains page context", () => {
  expect(failure(new RangeError("array buffer allocation failed"))).toEqual({
    code: "resource",
  })
  expect(
    failure(Object.assign(new Error("private details"), { page: 4 }))
  ).toEqual({ code: "invalid", page: 4 })
  expect(
    failure(Object.assign(new Error("private details"), { page: "4" })).page
  ).toBeUndefined()
  expect(failure(null).code).toBe("invalid")
})
