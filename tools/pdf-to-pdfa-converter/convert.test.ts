import { readFileSync } from "node:fs"
import { openPdfDocument } from "@workspace/pdf-reader/document"
import { PDFDocument } from "pdf-lib"
import { afterEach, describe, expect, it, vi } from "vitest"

import { convertPdf } from "./convert"

vi.mock("@workspace/pdf-reader/document", () => ({
  openPdfDocument: vi.fn(),
}))

const open = vi.mocked(openPdfDocument)
const source = new File(["pdf"], "source.pdf", { type: "application/pdf" })
const jpeg = new Uint8Array(
  readFileSync("tools/pdf-to-pdfa-converter/fixtures/page.jpg")
)

const options = () => ({
  profile: 2 as const,
  signal: new AbortController().signal,
  onProgress: vi.fn(),
})

function mockOpen(promise: Promise<unknown>) {
  const destroy = vi.fn().mockResolvedValue(undefined)
  open.mockReturnValue({ promise, destroy } as unknown as ReturnType<
    typeof openPdfDocument
  >)
  return destroy
}

function page(width: number, height: number) {
  return {
    getViewport: vi.fn(({ scale }) => ({
      width: width * scale,
      height: height * scale,
    })),
    render: vi.fn(() => ({ cancel: vi.fn(), promise: Promise.resolve() })),
    cleanup: vi.fn(),
  }
}

function documentWith(pages: ReturnType<typeof page>[]) {
  return {
    numPages: pages.length,
    getMetadata: vi.fn().mockResolvedValue({ info: {} }),
    getPage: vi.fn(async (n: number) => pages[n - 1]),
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  open.mockReset()
})

describe("converting input pages", () => {
  it("archives pages in order and scales a small source proportionally", async () => {
    const first = page(2, 200)
    const second = page(400, 300)
    const destroy = mockOpen(Promise.resolve(documentWith([first, second])))
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (done) => {
        done(new Blob([jpeg], { type: "image/jpeg" }))
      }
    )

    const { onProgress, ...rest } = options()
    const result = await convertPdf(source, { ...rest, onProgress })
    expect(result.status).toBe("ready")
    if (result.status !== "ready") return
    const output = await PDFDocument.load(await result.blob.arrayBuffer())
    expect(output.getPages().map((entry) => entry.getSize())).toEqual([
      { width: 3, height: 300 },
      { width: 400, height: 300 },
    ])
    expect(onProgress.mock.calls.flat()).toEqual([
      { stage: "rendering", page: 1, total: 2 },
      { stage: "rendering", page: 2, total: 2 },
      { stage: "checking" },
    ])
    expect(first.cleanup).toHaveBeenCalledOnce()
    expect(destroy).toHaveBeenCalledOnce()
  })

  it("returns an error for password-protected input", async () => {
    mockOpen(
      Promise.reject(
        Object.assign(new Error("Password required"), {
          name: "PasswordException",
        })
      )
    )
    await expect(convertPdf(source, options())).resolves.toEqual({
      status: "encrypted",
    })
  })

  it("returns an error when the source PDF cannot be opened", async () => {
    mockOpen(Promise.reject(new Error("Invalid PDF")))
    await expect(convertPdf(source, options())).resolves.toEqual({
      status: "invalid",
    })
  })

  it("rejects an XFA form without ordinary AcroForm fields", async () => {
    const doc = documentWith([page(600, 800)])
    doc.getMetadata.mockResolvedValue({
      info: { IsXFAPresent: true, IsAcroFormPresent: false },
    })
    mockOpen(Promise.resolve(doc))
    await expect(convertPdf(source, options())).resolves.toEqual({
      status: "xfa",
    })
    expect(doc.getPage).not.toHaveBeenCalled()
  })

  it("does not render pages with an aspect ratio too large for the profile", async () => {
    const extreme = page(15_000, 2)
    mockOpen(Promise.resolve(documentWith([extreme])))
    await expect(convertPdf(source, options())).resolves.toEqual({
      status: "checkFailed",
    })
    expect(extreme.render).not.toHaveBeenCalled()
  })

  it("does not render more pages than PDF/A-1b allows in the flat page tree", async () => {
    const doc = { ...documentWith([]), numPages: 8_192 }
    mockOpen(Promise.resolve(doc))
    await expect(
      convertPdf(source, { ...options(), profile: 1 })
    ).resolves.toEqual({ status: "checkFailed" })
    expect(doc.getPage).not.toHaveBeenCalled()
  })

  it("cancels an outstanding page request and releases the reader", async () => {
    const doc = documentWith([page(400, 300)])
    const loadingPage = new Promise<never>(() => {})
    doc.getPage.mockReturnValue(loadingPage)
    const destroy = mockOpen(Promise.resolve(doc))
    const controller = new AbortController()

    const conversion = convertPdf(source, {
      ...options(),
      signal: controller.signal,
    })
    await vi.waitFor(() => expect(doc.getPage).toHaveBeenCalledOnce())
    controller.abort()

    await expect(conversion).rejects.toThrow("aborted")
    expect(destroy).toHaveBeenCalledOnce()
  })
})
