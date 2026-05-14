import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { downloadArchiveEntry } from "./download"

import type { ArchiveEntry, ArchiveHandle } from "./core/types"

const createObjectUrlMock = vi.fn(() => "blob:download")
const revokeObjectUrlMock = vi.fn()
const anchorClickMock = vi.fn()

const entry: ArchiveEntry = {
  path: "docs/readme.txt",
  kind: "file",
  size: 5,
  compressedSize: null,
  modifiedAt: null,
  extension: "txt",
}

beforeEach(() => {
  vi.useFakeTimers()
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: createObjectUrlMock,
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: revokeObjectUrlMock,
  })
  Object.defineProperty(HTMLAnchorElement.prototype, "click", {
    configurable: true,
    value: anchorClickMock,
  })
})

afterEach(() => {
  vi.useRealTimers()
  createObjectUrlMock.mockClear()
  revokeObjectUrlMock.mockClear()
  anchorClickMock.mockClear()
})

describe("downloadArchiveEntry", () => {
  test("downloads a file entry and revokes the object URL", async () => {
    const handle: ArchiveHandle = {
      format: "zip",
      entries: [entry],
      readEntry: vi.fn(async () => new Blob(["hello"], { type: "text/plain" })),
      dispose: vi.fn(async () => {}),
    }

    await downloadArchiveEntry(handle, entry)
    vi.runAllTimers()

    expect(handle.readEntry).toHaveBeenCalledWith("docs/readme.txt")
    expect(anchorClickMock).toHaveBeenCalled()
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:download")
  })
})
