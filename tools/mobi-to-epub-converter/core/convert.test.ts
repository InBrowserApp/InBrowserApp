import { beforeEach, expect, test, vi } from "vitest"
import { convert } from "./convert"
import { failure } from "./failure"
import m from "../messages/en.json"
const mock = vi.hoisted(() => ({
  openBook: vi.fn(),
  snapshotBook: vi.fn(),
  dispose: vi.fn(),
  writeEpub: vi.fn(),
  readingDocument: vi.fn(),
  readingPreview: vi.fn(),
}))
vi.mock("@workspace/ebook/mobi", () => ({ openBook: mock.openBook }))
vi.mock("@workspace/ebook", () => ({ snapshotBook: mock.snapshotBook }))
vi.mock("@workspace/ebook/write-epub", () => ({ writeEpub: mock.writeEpub }))
vi.mock("@workspace/ebook/document", () => ({
  readingDocument: mock.readingDocument,
  readingPreview: mock.readingPreview,
}))
beforeEach(() => {
  vi.resetAllMocks()
  mock.openBook.mockResolvedValue({ dispose: mock.dispose })
  mock.snapshotBook.mockResolvedValue({ title: "Book" })
  mock.writeEpub.mockResolvedValue(new Blob(["epub"]))
  mock.readingDocument.mockReturnValue({ doc: "document", notes: ["note"] })
  mock.readingPreview.mockReturnValue({ title: "Book", html: "Read" })
})
test("releases all source resources on success, packaging failure and cancellation", async () => {
  const file = new File(["book"], "book.mobi")
  const controller = new AbortController()
  const output = await convert(file, controller.signal, m)
  expect(output.preview.html).toBe("Read")
  expect(output.notes).toEqual(["note"])
  expect(mock.openBook).toHaveBeenCalledWith(file, controller.signal)
  expect(mock.writeEpub).toHaveBeenCalledWith(
    { title: "Book" },
    controller.signal,
    m
  )
  expect(mock.dispose).toHaveBeenCalledOnce()
  mock.writeEpub.mockRejectedValueOnce(new Error("incomplete"))
  await expect(convert(file, controller.signal, m)).rejects.toThrow(
    "incomplete"
  )
  expect(mock.dispose).toHaveBeenCalledTimes(2)
  mock.writeEpub.mockImplementationOnce(() => {
    controller.abort()
    return new Blob()
  })
  await expect(convert(file, controller.signal, m)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(mock.dispose).toHaveBeenCalledTimes(3)
  expect(mock.readingPreview).toHaveBeenCalledOnce()
})
test("reports format errors without exposing engine diagnostics", () => {
  for (const key of [
    "protected",
    "incomplete",
    "empty",
    "unsupportedLayout",
    "unsupportedVariant",
    "encoding",
    "unsupported",
  ])
    expect(failure(new Error(key))).toBe(key)
  expect(failure(new RangeError())).toBe("resourceLimit")
  expect(failure(new Error("private details"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
})
