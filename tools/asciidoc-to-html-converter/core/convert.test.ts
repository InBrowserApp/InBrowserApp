import { afterEach, expect, test, vi } from "vitest"
import { readAsciiDoc } from "@workspace/asciidoc"
import { readerStyle } from "@workspace/asciidoc/styles"
import { exportWebDocument } from "@workspace/web-document/export"
import { convert } from "./convert"
import { failure } from "./errors"

vi.mock("@workspace/asciidoc", () => ({ readAsciiDoc: vi.fn() }))
vi.mock("@workspace/web-document/export", () => ({
  exportWebDocument: vi.fn(),
}))
afterEach(() => vi.resetAllMocks())
const document = { html: "<h1>Field manual</h1>", warnings: false }

test("exports the parsed document using the shared reading theme and exact result", async () => {
  vi.mocked(readAsciiDoc).mockResolvedValue(document)
  const result = { preview: {} as never, file: new Blob(["safe"]) }
  vi.mocked(exportWebDocument).mockResolvedValue(result)
  const file = new File(["= Manual"], "manual.adoc"),
    signal = new AbortController().signal
  expect(await convert(file, signal, "Document")).toBe(result)
  expect(readAsciiDoc).toHaveBeenCalledWith(file, signal)
  expect(exportWebDocument).toHaveBeenCalledWith(
    document.html,
    signal,
    "Document",
    readerStyle
  )
})

test.each([
  [{ ...document, warnings: true }, "warnings"],
  [
    {
      ...document,
      html: '<p>Manual</p><a class="include" href="chapter.adoc">chapter.adoc</a>',
    },
    "includes",
  ],
])("rejects incomplete parsed content before export", async (source, code) => {
  vi.mocked(readAsciiDoc).mockResolvedValue(source)
  await expect(
    convert(
      new File([], "manual.adoc"),
      new AbortController().signal,
      "Document"
    )
  ).rejects.toThrow(code)
  expect(exportWebDocument).not.toHaveBeenCalled()
})

test("does not mistake literal include examples for unavailable files", async () => {
  const source = {
    ...document,
    html: '<pre>&lt;a class="include" href="sample.adoc"&gt;Example&lt;/a&gt;</pre>',
  }
  vi.mocked(readAsciiDoc).mockResolvedValue(source)
  await convert(
    new File([], "manual.adoc"),
    new AbortController().signal,
    "Document"
  )
  expect(exportWebDocument).toHaveBeenCalledWith(
    source.html,
    expect.any(AbortSignal),
    "Document",
    readerStyle
  )
})

test("discards canceled worker results before preparing HTML", async () => {
  const controller = new AbortController()
  vi.mocked(readAsciiDoc).mockImplementation(async () => {
    controller.abort()
    return document
  })
  await expect(
    convert(new File([], "manual.adoc"), controller.signal, "Document")
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(exportWebDocument).not.toHaveBeenCalled()
})

test("classifies encoding, source and resource failures without leaking document text", () => {
  for (const code of [
    "invalid",
    "unsupported",
    "encoding",
    "includes",
    "warnings",
    "resource",
    "engineUnavailable",
  ])
    expect(failure(new Error(code))).toBe(code)
  expect(failure(new Error("ENCODING"))).toBe("encoding")
  expect(failure(new Error("resourceLimit"))).toBe("resource")
  expect(failure(new RangeError("allocation failed"))).toBe("resource")
  expect(failure("private source text")).toBe("invalid")
})
