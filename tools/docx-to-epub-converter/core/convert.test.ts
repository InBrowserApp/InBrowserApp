import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type {
  BodyElement,
  DocNote,
  DocParagraph,
  DocRun,
} from "@silurus/ooxml/docx"
import type { BookSnapshot } from "@workspace/ebook"
import { convert, failure } from "./convert"
import messages from "../messages/en.json"

const mock = vi.hoisted(() => ({
  load: vi.fn(),
  readArchive: vi.fn(),
  bookImages: vi.fn(),
  embed: vi.fn(),
  transform: vi.fn(),
  writeEpub: vi.fn(),
  getImage: vi.fn(),
  destroy: vi.fn(),
}))
vi.mock("@silurus/ooxml/docx", () => ({ DocxDocument: { load: mock.load } }))
vi.mock("./archive", () => ({ readArchive: mock.readArchive }))
vi.mock("@workspace/ebook/images", () => ({ bookImages: mock.bookImages }))
vi.mock("./image-transform", () => ({ imageTransform: mock.transform }))
vi.mock("@workspace/ebook/write-epub", () => ({ writeEpub: mock.writeEpub }))

const illustration = "data:image/png;base64,AA=="
const raster = "word/media/image.png"
const vector = "word/media/diagram.svg"
const model: {
  body: BodyElement[]
  footnotes?: DocNote[]
  endnotes?: DocNote[]
  parseError?: string
} = {
  body: [],
}
const properties = {
  entries: new Set([raster, vector]),
  title: "Field Guide",
  author: "Author",
  description: "A Word manuscript",
  language: "en-US",
}
const images = { embed: mock.embed, missing: false }
const saving = vi.fn()
let abort: AbortController
let output: Blob

function text(value: string, attrs: Record<string, unknown> = {}): DocRun {
  return { type: "text", text: value, ...attrs } as DocRun
}

function paragraph(runs: DocRun[], attrs: Partial<DocParagraph> = {}) {
  return { type: "paragraph", runs, ...attrs } as BodyElement
}

function image(imagePath = raster, svgImagePath?: string): DocRun {
  return {
    type: "image",
    widthPt: 300,
    heightPt: 200,
    mimeType: "image/png",
    imagePath,
    svgImagePath,
  }
}

function run(name = "manuscript.docx") {
  return convert(new File(["docx"], name), abort.signal, messages, saving)
}

function published() {
  return mock.writeEpub.mock.calls.at(-1)![0] as BookSnapshot
}

beforeEach(() => {
  vi.resetAllMocks()
  abort = new AbortController()
  output = new Blob(["epub"])
  model.body = [paragraph([text("Ordinary text")])]
  delete model.footnotes
  delete model.endnotes
  delete model.parseError
  images.missing = false
  mock.load.mockResolvedValue({
    document: model,
    getImage: mock.getImage,
    destroy: mock.destroy,
  })
  mock.readArchive.mockReturnValue(properties)
  mock.bookImages.mockReturnValue(images)
  mock.getImage.mockResolvedValue(new Blob(["image"], { type: "image/png" }))
  mock.embed.mockResolvedValue(illustration)
  mock.transform.mockImplementation(async (url: string) => url)
  mock.writeEpub.mockResolvedValue(output)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:word-asset")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

test("creates ordered chapters, nested contents, metadata and referenced supporting notes", async () => {
  const firstNote = text("", { noteRef: { kind: "footnote", id: "5" } })
  model.footnotes = [
    { id: "5", content: [paragraph([text("Read the original footnote.")])] },
  ]
  model.endnotes = [
    { id: "6", content: [paragraph([text("Read the original endnote.")])] },
  ]
  model.body = [
    paragraph([text("Opening text")]),
    paragraph([text("First chapter")], { styleId: "Heading1" }),
    paragraph([text("Details")], { styleId: "Heading2" }),
    paragraph([text("  ")], { styleId: "Heading2" }),
    paragraph([
      text("Go to chapter two", { hyperlinkAnchor: "later" }),
      text("Unknown bookmark", { hyperlinkAnchor: "missing" }),
      firstNote,
      firstNote,
      text("", { noteRef: { kind: "endnote", id: "6" } }),
      text("Missing note marker", { noteRef: { kind: "footnote", id: "99" } }),
    ]),
    paragraph([text("Second chapter")], {
      styleId: "Heading1",
      bookmarks: ["later"],
    }),
    paragraph([text("Last paragraph")]),
  ]
  const result = await run()
  const book = published()
  expect(book).toMatchObject({
    title: "Field Guide",
    author: "Author",
    description: "A Word manuscript",
    language: "en-US",
    unresolved: true,
    missing: false,
  })
  expect(
    book.chapters.map(({ title, supporting }) => [title, supporting])
  ).toEqual([
    ["Field Guide", false],
    ["First chapter", false],
    ["Second chapter", false],
    ["Notes", true],
  ])
  expect(book.contents?.map(({ label }) => label)).toEqual([
    "Field Guide",
    "First chapter",
    "Second chapter",
    "Notes",
  ])
  expect(book.contents?.[1]?.subitems?.map(({ label }) => label)).toEqual([
    "Details",
    "First chapter",
  ])
  expect(book.chapters[1]!.html).toContain("Go to chapter two</a>")
  expect(book.chapters[1]!.html).toContain("<a>Unknown bookmark</a>")
  expect(book.chapters[1]!.html.match(/href="#word-note-1"/g)).toHaveLength(2)
  expect(book.chapters[1]!.html).toContain("Missing note marker")
  expect(book.chapters[3]!.html).toContain("Read the original footnote.")
  expect(book.chapters[3]!.html).toContain("Read the original endnote.")
  expect(saving.mock.invocationCallOrder[0]).toBeLessThan(
    mock.writeEpub.mock.invocationCallOrder[0]!
  )
  expect(mock.writeEpub).toHaveBeenCalledWith(book, abort.signal, messages)
  expect(result.file).toBe(output)
  expect(result.preview.html).toContain("Opening text")
  expect(result.notes).toContain(messages.unresolvedLinks)
  expect(mock.destroy).toHaveBeenCalledOnce()
})

test("reuses local image bytes, prefers a present SVG, and leaves external and absent parts unrequested", async () => {
  model.body = [
    paragraph([image(raster, vector), image(raster, vector), image()]),
    paragraph([
      image("https://example.com/remote.png"),
      image("word/media/missing.png"),
    ]),
  ]
  const result = await run()
  expect(mock.getImage.mock.calls).toEqual([
    [vector, "image/svg+xml"],
    [raster, "image/png"],
  ])
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
  expect(mock.transform).toHaveBeenCalledTimes(3)
  expect(published().chapters[0]!.html.match(/<img /g)).toHaveLength(3)
  expect(published().missing).toBe(true)
  expect(result.notes).toContain(messages.missingResources)
})

test("publishes an image-only document when SVG decoding falls back to the raster part", async () => {
  model.body = [paragraph([image(raster, vector)], { styleId: "Heading1" })]
  mock.embed.mockResolvedValueOnce(null)
  mock.readArchive.mockReturnValue({ ...properties, title: "" })
  images.missing = true
  const result = await run("Illustrations.DOCX")
  expect(mock.getImage.mock.calls).toEqual([
    [vector, "image/svg+xml"],
    [raster, "image/png"],
  ])
  expect(published()).toMatchObject({
    title: "Illustrations",
    missing: true,
    contents: [{ label: "Illustrations" }],
  })
  expect(result.preview.html).toContain(illustration)
})

test("marks unreadable image parts, caches the failed read, and keeps surrounding text", async () => {
  model.body = [paragraph([text("Available"), image(), image()])]
  mock.getImage.mockRejectedValue(new Error("Part missing"))
  mock.readArchive.mockReturnValue({ ...properties, title: "" })
  const result = await run(".docx")
  expect(mock.getImage).toHaveBeenCalledOnce()
  expect(URL.revokeObjectURL).not.toHaveBeenCalled()
  expect(published()).toMatchObject({
    title: ".docx",
    missing: true,
    unresolved: false,
  })
  expect(result.preview.html).toContain("Available")
  expect(result.preview.html).toContain(messages.imageUnavailable)
})

test("propagates resource limits while releasing source and object URLs", async () => {
  model.body = [paragraph([image()])]
  mock.getImage.mockRejectedValueOnce(new RangeError("too much data"))
  await expect(run()).rejects.toThrow("too much data")
  mock.embed.mockRejectedValueOnce(
    Object.assign(new Error("too large"), { code: "ooxml-resource-limit" })
  )
  await expect(run()).rejects.toThrow("too large")
  expect(URL.revokeObjectURL).toHaveBeenCalledOnce()
  expect(mock.destroy).toHaveBeenCalledTimes(2)
  expect(mock.writeEpub).not.toHaveBeenCalled()
})

test("cancels during reading, parsing and image loading without publishing stale work", async () => {
  const expected = new Error("user canceled")
  abort.abort(expected)
  await expect(run()).rejects.toThrow(expected)
  expect(mock.load).not.toHaveBeenCalled()

  abort = new AbortController()
  mock.load.mockImplementationOnce(async () => {
    abort.abort(expected)
    return { document: model, getImage: mock.getImage, destroy: mock.destroy }
  })
  await expect(run()).rejects.toThrow(expected)

  abort = new AbortController()
  model.body = [paragraph([image()])]
  mock.getImage.mockImplementationOnce(async () => {
    abort.abort(expected)
    return new Blob(["image"])
  })
  await expect(run()).rejects.toThrow(expected)
  expect(mock.destroy).toHaveBeenCalledTimes(2)
  expect(mock.writeEpub).not.toHaveBeenCalled()
})

test("does not publish unreadable or blank manuscripts and always releases the parser", async () => {
  model.parseError = "Broken XML"
  await expect(run()).rejects.toThrow("invalid")
  delete model.parseError
  model.body = []
  await expect(run()).rejects.toThrow("empty")
  model.body = [paragraph([text("Available")])]
  mock.writeEpub.mockRejectedValueOnce(new Error("Packaging failed"))
  await expect(run()).rejects.toThrow("Packaging failed")
  expect(mock.destroy).toHaveBeenCalledTimes(3)
  expect(mock.writeEpub).toHaveBeenCalledOnce()
})

test("reports supported failure types without showing private engine diagnostics", () => {
  expect(failure(new Error("protected"))).toBe("protected")
  expect(failure(new Error("empty"))).toBe("empty")
  expect(failure(new Error("TOO_LARGE"))).toBe("resourceLimit")
  expect(failure(new RangeError("binary length"))).toBe("resourceLimit")
  expect(failure(new Error("private diagnostic"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
})
