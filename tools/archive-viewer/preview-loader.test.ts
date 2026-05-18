import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import {
  cleanupLoadedPreview,
  cleanupPreview,
  loadEntryPreview,
} from "./preview-loader"
import messagesCatalog from "./messages/en.json"

import type { ArchiveViewerMessages } from "./types"
import type { ArchiveEntry, ArchiveHandle } from "./core/types"

const createObjectUrlMock = vi.fn(() => "blob:preview")
const revokeObjectUrlMock = vi.fn()

const messages = {
  meta: {
    name: "Archive Viewer",
    description: "Inspect archive files.",
  },
  ...messagesCatalog,
} as const satisfies ArchiveViewerMessages

function entry(path: string, extension: string, size = 1): ArchiveEntry {
  return {
    path,
    kind: "file",
    size,
    compressedSize: null,
    modifiedAt: null,
    extension,
  }
}

function handleWith(blob: Blob): ArchiveHandle {
  return {
    format: "zip",
    entries: [],
    readEntry: vi.fn(async () => blob),
    dispose: vi.fn(async () => {}),
  }
}

beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: createObjectUrlMock,
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: revokeObjectUrlMock,
  })
})

afterEach(() => {
  createObjectUrlMock.mockClear()
  revokeObjectUrlMock.mockClear()
})

describe("preview loader", () => {
  test("loads text previews with a reusable download URL", async () => {
    const loaded = await loadEntryPreview(
      handleWith(new Blob(["hello"], { type: "text/plain" })),
      entry("readme.txt", "txt"),
      messages
    )

    expect(loaded.preview.status).toBe("text")
    expect(loaded.textDownloadUrl).toBe("blob:preview")

    cleanupLoadedPreview(loaded)
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:preview")
  })

  test("loads image previews with the image object URL", async () => {
    const loaded = await loadEntryPreview(
      handleWith(new Blob(["image"], { type: "image/png" })),
      entry("logo.png", "png"),
      messages
    )

    expect(loaded.preview.status).toBe("image")
    expect(loaded.textDownloadUrl).toBeNull()

    cleanupPreview(loaded.preview)
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:preview")
  })

  test("loads PDF previews with the PDF object URL", async () => {
    const loaded = await loadEntryPreview(
      handleWith(new Blob(["%PDF-1.4"], { type: "application/octet-stream" })),
      entry("report.pdf", "pdf"),
      messages
    )

    expect(loaded.preview.status).toBe("pdf")
    if (loaded.preview.status !== "pdf") throw new Error("Expected PDF preview")

    expect(loaded.preview.blob.type).toBe("application/pdf")
    expect(loaded.textDownloadUrl).toBeNull()
    expect(createObjectUrlMock).toHaveBeenCalledWith(loaded.preview.blob)

    cleanupPreview(loaded.preview)
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:preview")
  })

  test("keeps large and binary entries downloadable without text rendering", async () => {
    const large = await loadEntryPreview(
      handleWith(new Blob([new Uint8Array(1024 * 1024 + 1)])),
      entry("large.txt", "txt", 1024 * 1024 + 1),
      messages
    )
    const binary = await loadEntryPreview(
      handleWith(new Blob([new Uint8Array([1, 2, 3])])),
      entry("data.bin", "bin", 3),
      messages
    )

    expect(large.preview).toMatchObject({
      status: "unavailable",
      message: messages.previewTooLarge,
    })
    expect(binary.preview).toMatchObject({
      status: "unavailable",
      message: messages.noPreview,
    })
    expect(large.textDownloadUrl).toBe("blob:preview")
    expect(binary.textDownloadUrl).toBe("blob:preview")
  })
})
