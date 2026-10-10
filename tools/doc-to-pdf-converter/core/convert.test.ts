import { beforeEach, expect, test, vi } from "vitest"
import { openDocument } from "../open-document"
import { renderPdf } from "@workspace/html-pdf"
import { convert } from "./convert"
vi.mock("../open-document", () => ({ openDocument: vi.fn() }))
vi.mock("@workspace/html-pdf", () => ({ renderPdf: vi.fn() }))
const source = { html: "<p>Report</p>", css: "" }
const result = { pdf: new Blob(["%PDF"]), pages: 1 }
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(openDocument).mockResolvedValue(source)
  vi.mocked(renderPdf).mockResolvedValue(result)
})
test("renders only successfully parsed content and returns exact output", async () => {
  const file = new File(["doc"], "report.doc"),
    signal = new AbortController().signal,
    progress = vi.fn()
  expect(await convert(file, signal, progress)).toBe(result)
  expect(openDocument).toHaveBeenCalledWith(file, signal)
  expect(renderPdf).toHaveBeenCalledWith(source, signal, progress)
})
test("does not render rejected or stale documents", async () => {
  const controller = new AbortController()
  vi.mocked(openDocument).mockImplementationOnce(async () => {
    controller.abort()
    return source
  })
  await expect(
    convert(new File([], "file.doc"), controller.signal, vi.fn())
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(renderPdf).not.toHaveBeenCalled()
})
