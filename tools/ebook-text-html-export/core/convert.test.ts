import { beforeEach, expect, test, vi } from "vitest"
import { convert } from "./convert"
import { failure } from "./failure"
import m from "../messages/en.json"
const mock = vi.hoisted(() => ({
  openEbook: vi.fn(),
  snapshotBook: vi.fn(),
  dispose: vi.fn(),
  ebookDocument: vi.fn(),
}))
vi.mock("@workspace/ebook", () => ({
  openEbook: mock.openEbook,
  snapshotBook: mock.snapshotBook,
}))
vi.mock("./document", () => ({ ebookDocument: mock.ebookDocument }))
beforeEach(() => {
  vi.resetAllMocks()
  mock.openEbook.mockResolvedValue({ dispose: mock.dispose })
  mock.snapshotBook.mockResolvedValue({ title: "Book" })
  mock.ebookDocument.mockReturnValue({ text: "Read" })
})
test("always releases the opened book after success, incomplete export, or cancellation", async () => {
  const file = new File(["book"], "book.epub")
  const controller = new AbortController()
  expect(await convert(file, controller.signal, m)).toEqual({ text: "Read" })
  expect(mock.openEbook).toHaveBeenCalledWith(file, controller.signal)
  expect(mock.ebookDocument).toHaveBeenCalledWith({ title: "Book" }, m)
  expect(mock.dispose).toHaveBeenCalledTimes(1)
  mock.snapshotBook.mockRejectedValueOnce(new Error("incomplete"))
  await expect(convert(file, controller.signal, m)).rejects.toThrow(
    "incomplete"
  )
  expect(mock.dispose).toHaveBeenCalledTimes(2)
  mock.snapshotBook.mockImplementationOnce(() => {
    controller.abort()
    return {}
  })
  await expect(convert(file, controller.signal, m)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(mock.dispose).toHaveBeenCalledTimes(3)
  expect(mock.ebookDocument).toHaveBeenCalledTimes(1)
})
test("reports known format failures without exposing parser diagnostics", () => {
  for (const key of [
    "protected",
    "incomplete",
    "empty",
    "unsupportedLayout",
    "unsupportedVariant",
    "encoding",
    "noBook",
    "ambiguous",
    "unsupported",
  ])
    expect(failure(new Error(key))).toBe(key)
  expect(failure(new RangeError("allocation"))).toBe("resourceLimit")
  expect(failure(new Error("internal details"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
})
