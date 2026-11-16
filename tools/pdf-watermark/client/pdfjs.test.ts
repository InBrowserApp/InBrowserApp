import { afterEach, expect, test, vi } from "vitest"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import { loadPdf } from "./pdfjs"

vi.mock("pdfjs-dist", () => ({ getDocument: vi.fn(), GlobalWorkerOptions: {} }))
const mockedGetDocument = vi.mocked(getDocument)
afterEach(() => vi.unstubAllGlobals())

test("loads PDF.js resources from bundled local assets with explicit failure handling", async () => {
  const data = new Uint8Array([1, 2])
  loadPdf(data)
  expect(GlobalWorkerOptions.workerSrc).toContain("pdf.worker.mjs")
  const config = mockedGetDocument.mock.calls.at(-1)![0] as {
    data: Uint8Array
    useWorkerFetch: boolean
    BinaryDataFactory: new () => {
      fetch: (request: {
        kind: string
        filename: string
      }) => Promise<Uint8Array>
    }
  }
  expect(config.data).toBe(data)
  expect(config.useWorkerFetch).toBe(false)
  const factory = new config.BinaryDataFactory()
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: async () => new Uint8Array([7]).buffer,
  })
  vi.stubGlobal("fetch", fetcher)
  await expect(
    factory.fetch({ kind: "cMapUrl", filename: "Adobe-Japan1-UCS2.bcmap" })
  ).resolves.toEqual(new Uint8Array([7]))
  expect(fetcher.mock.calls[0]![0]).toContain("Adobe-Japan1-UCS2.bcmap")
  fetcher.mockResolvedValueOnce({ ok: false })
  await expect(
    factory.fetch({ kind: "cMapUrl", filename: "Adobe-Japan1-UCS2.bcmap" })
  ).rejects.toThrow("previewError")
  await expect(
    factory.fetch({ kind: "cMapUrl", filename: "missing.bcmap" })
  ).rejects.toThrow("previewError")
})
