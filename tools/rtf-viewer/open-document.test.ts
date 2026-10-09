import { beforeEach, expect, test, vi } from "vitest"
import { openDocument } from "./open-document"
const mocks = vi.hoisted(() => ({ load: vi.fn() }))
vi.mock("rtf-viewer", () => ({ RtfDocument: { load: mocks.load } }))
const file = (content = "{\\rtf1 text}") => new File([content], "sample.rtf")
beforeEach(() => mocks.load.mockReset())
test("checks the real RTF signature and cancellation before parsing", async () => {
  await expect(
    openDocument(file("not rtf"), new AbortController().signal)
  ).rejects.toThrow("invalid")
  expect(mocks.load).not.toHaveBeenCalled()
  const controller = new AbortController()
  controller.abort()
  await expect(openDocument(file(), controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
})
test("checks cancellation after reading bytes and discards a late parsed model", async () => {
  const controller = new AbortController()
  const chosen = file()
  vi.spyOn(chosen, "slice").mockReturnValue({
    arrayBuffer: async () => {
      controller.abort()
      return new ArrayBuffer(6)
    },
  } as Blob)
  await expect(openDocument(chosen, controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
  const next = new AbortController()
  const document = { destroy: vi.fn() }
  mocks.load.mockImplementation(async () => {
    next.abort()
    return document
  })
  await expect(openDocument(file(), next.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(document.destroy).toHaveBeenCalledOnce()
})
test("rejects empty content, accepts images and text after empty pages", async () => {
  const document = {
    pageCount: 1,
    getPageLayout: vi.fn().mockReturnValue({
      lines: [{ fragments: [{ kind: "text", text: " " }] }],
    }),
    destroy: vi.fn(),
  }
  mocks.load.mockResolvedValue(document)
  await expect(
    openDocument(file(), new AbortController().signal)
  ).rejects.toThrow("empty")
  expect(document.destroy).toHaveBeenCalledOnce()
  document.getPageLayout.mockReturnValue({
    lines: [{ fragments: [{ kind: "image" }] }],
  })
  expect(await openDocument(file(), new AbortController().signal)).toBe(
    document
  )
  document.pageCount = 2
  document.getPageLayout
    .mockReturnValueOnce({ lines: [] })
    .mockReturnValueOnce({
      lines: [{ fragments: [{ kind: "text", text: "content" }] }],
    })
  expect(await openDocument(file(), new AbortController().signal)).toBe(
    document
  )
})
