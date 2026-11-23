// @vitest-environment node
import { BlobReader, TextWriter, ZipReader, ZipWriter } from "@zip.js/zip.js"
import { expect, test, vi } from "vitest"
import { archiveImages } from "./zip"

const image = {
  name: "测试.webp",
  blob: new Blob(["encoded"]),
  width: 10,
  height: 10,
}

test("packs exact bytes under the expected Unicode names", async () => {
  const blob = await archiveImages([image], new AbortController().signal)
  expect(blob.type).toBe("application/zip")
  const reader = new ZipReader(new BlobReader(blob))
  try {
    const [entry] = await reader.getEntries()
    expect(entry?.filename).toBe(image.name)
    expect(
      entry && !entry.directory
        ? await entry.getData(new TextWriter())
        : undefined
    ).toBe("encoded")
  } finally {
    await reader.close()
  }
})

test("propagates cancellation before opening the ZIP writer", async () => {
  await expect(archiveImages([image], AbortSignal.abort())).rejects.toThrow(
    /abort/i
  )
})

test("preserves the original ZIP error when finalization also fails", async () => {
  const close = vi
    .spyOn(ZipWriter.prototype, "close")
    .mockRejectedValueOnce(new Error("close failed"))
  try {
    await expect(
      archiveImages([image, image], new AbortController().signal)
    ).rejects.toThrow(/already exists/i)
    expect(close).toHaveBeenCalledOnce()
  } finally {
    close.mockRestore()
  }
})
