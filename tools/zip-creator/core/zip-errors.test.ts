// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest"

import { createZip } from "./zip"

const mock = vi.hoisted(() => ({ add: vi.fn(), close: vi.fn() }))
vi.mock("@zip.js/zip.js", () => ({
  ZipWriter: class {
    add = mock.add
    close = mock.close
  },
  BlobWriter: class {},
  BlobReader: class {},
}))
beforeEach(() => {
  mock.add.mockReset().mockResolvedValue(undefined)
  mock.close.mockReset().mockResolvedValue(new Blob([]))
})

it("keeps the original read error when abandoned writer cleanup also fails", async () => {
  const readError = new Error("file is no longer available")
  mock.add.mockRejectedValue(readError)
  mock.close.mockRejectedValue(new Error("partial writer could not close"))
  await expect(
    createZip(
      [{ path: "missing.txt", file: new File([], "missing.txt") }],
      6,
      new AbortController().signal,
      () => {}
    )
  ).rejects.toBe(readError)
  expect(mock.close).toHaveBeenCalledOnce()
})

it("does not expose a ZIP cancelled during finalization", async () => {
  const controller = new AbortController()
  mock.close.mockImplementation(async () => {
    controller.abort()
    return new Blob([])
  })
  await expect(
    createZip([], 6, controller.signal, () => {})
  ).rejects.toMatchObject({ name: "AbortError" })
})

it("propagates finalization errors", async () => {
  mock.close.mockRejectedValue(new Error("disk or memory exhausted"))
  await expect(
    createZip([], 0, new AbortController().signal, () => {})
  ).rejects.toThrow("disk or memory exhausted")
})
