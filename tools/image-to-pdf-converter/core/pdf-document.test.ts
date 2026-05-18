import { beforeEach, describe, expect, test, vi } from "vitest"

import { DEFAULT_CONVERTER_OPTIONS } from "./options"

const drawImage = vi.fn()
const pushOperators = vi.fn()
const embedJpg = vi.fn(async () => "embedded-image")
const addPage = vi.fn(() => ({ drawImage, pushOperators }))
const save = vi.fn(async () => new Uint8Array([37, 80, 68, 70]))

vi.mock("pdf-lib", () => ({
  PDFDocument: {
    create: vi.fn(async () => ({
      addPage,
      embedJpg,
      save,
    })),
  },
  clip: vi.fn(() => "clip"),
  endPath: vi.fn(() => "endPath"),
  popGraphicsState: vi.fn(() => "popGraphicsState"),
  pushGraphicsState: vi.fn(() => "pushGraphicsState"),
  rectangle: vi.fn(() => "rectangle"),
}))

describe("image-to-pdf PDF document assembly", () => {
  beforeEach(() => {
    drawImage.mockClear()
    pushOperators.mockClear()
    embedJpg.mockClear()
    addPage.mockClear()
    save.mockClear()
  })

  test("creates one PDF page per rendered image", async () => {
    const { createImagePdf } = await import("./pdf-document")
    const progress: Array<{ completed: number; total: number }> = []
    const bytes = await createImagePdf({
      images: [
        { jpegBytes: new Uint8Array([1]), width: 200, height: 400 },
        { jpegBytes: new Uint8Array([2]), width: 400, height: 200 },
      ],
      options: DEFAULT_CONVERTER_OPTIONS,
      onProgress: (nextProgress) => {
        progress.push(nextProgress)
      },
    })

    expect(bytes).toEqual(new Uint8Array([37, 80, 68, 70]))
    expect(embedJpg).toHaveBeenCalledTimes(2)
    expect(addPage).toHaveBeenCalledTimes(2)
    expect(drawImage).toHaveBeenCalledTimes(2)
    expect(pushOperators).not.toHaveBeenCalled()
    expect(progress).toEqual([
      { completed: 1, total: 2 },
      { completed: 2, total: 2 },
    ])
  })

  test("clips cover placement to the margin box", async () => {
    const { createImagePdf } = await import("./pdf-document")

    await createImagePdf({
      images: [{ jpegBytes: new Uint8Array([1]), width: 400, height: 200 }],
      options: {
        ...DEFAULT_CONVERTER_OPTIONS,
        fitMode: "cover",
        marginMm: 10,
      },
    })

    expect(pushOperators).toHaveBeenCalledTimes(2)
  })

  test("creates PDF blobs with the expected MIME type", async () => {
    const { PDF_MIME_TYPE, createPdfBlob } = await import("./pdf-document")
    const blob = createPdfBlob(new Uint8Array([1, 2, 3]))

    expect(blob.type).toBe(PDF_MIME_TYPE)
    expect(await blob.arrayBuffer()).toEqual(new Uint8Array([1, 2, 3]).buffer)
  })
})
