import { afterEach, expect, test, vi } from "vitest"
import { readWebArchive } from "@workspace/web-document/archive"
import { exportWebDocument } from "@workspace/web-document/export"
import { convert } from "./convert"
import { failure } from "./errors"

vi.mock("@workspace/web-document/archive", () => ({ readWebArchive: vi.fn() }))
vi.mock("@workspace/web-document/export", () => ({
  exportWebDocument: vi.fn(),
}))
afterEach(() => vi.resetAllMocks())
const archive = {
  source: "<h1>Saved</h1>",
  location: "https://original.invalid/",
  archiveNotes: { truncated: false, encoding: false, nested: false },
}

test("exports only the parsed local archive and returns its exact output", async () => {
  vi.mocked(readWebArchive).mockResolvedValue(archive)
  const result = { preview: {} as never, file: new Blob(["safe"]) }
  vi.mocked(exportWebDocument).mockResolvedValue(result)
  const file = new File(["MIME"], "report.mht"),
    signal = new AbortController().signal
  expect(await convert(file, signal, "Document")).toBe(result)
  expect(readWebArchive).toHaveBeenCalledWith(file, signal)
  expect(exportWebDocument).toHaveBeenCalledWith(
    archive.source,
    signal,
    "Document"
  )
})

test.each([
  ["truncated", "incomplete"],
  ["encoding", "encoding"],
  ["nested", "nested"],
])("rejects %s archives before export", async (note, code) => {
  vi.mocked(readWebArchive).mockResolvedValue({
    ...archive,
    archiveNotes: { ...archive.archiveNotes, [note!]: true },
  })
  await expect(
    convert(new File([], "x.mht"), new AbortController().signal, "Document")
  ).rejects.toThrow(code)
  expect(exportWebDocument).not.toHaveBeenCalled()
})

test("discards a canceled archive before DOM/export work", async () => {
  const controller = new AbortController()
  vi.mocked(readWebArchive).mockImplementation(async () => {
    controller.abort()
    return archive
  })
  await expect(
    convert(new File([], "x.mht"), controller.signal, "Document")
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(exportWebDocument).not.toHaveBeenCalled()
})

test("classifies parsing and allocation failures without exposing document data", () => {
  for (const code of [
    "invalid",
    "unsupported",
    "encoding",
    "resource",
    "engineUnavailable",
    "incomplete",
    "nested",
    "structure",
    "email",
  ])
    expect(failure(new Error(code))).toBe(code)
  expect(failure(new RangeError("allocation failed"))).toBe("resource")
  expect(failure(new Error("resourceLimit"))).toBe("resource")
  expect(failure("private source text")).toBe("invalid")
})
