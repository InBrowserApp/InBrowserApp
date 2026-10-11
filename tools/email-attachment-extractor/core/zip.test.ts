import { expect, test } from "vitest"
import { BlobReader, Uint8ArrayWriter, ZipReader } from "@zip.js/zip.js"
import { createZip } from "./zip"

test("archives selected original bytes, Unicode names and zero-byte entries", async () => {
  const input = [
    { filename: "世界.bin", file: new Blob([new Uint8Array([0, 128, 255])]) },
    { filename: "empty.dat", file: new Blob([]) },
  ]
  const blob = await createZip(input, new AbortController().signal)
  expect(blob.type).toBe("application/zip")
  const reader = new ZipReader(new BlobReader(blob), { useWebWorkers: false })
  try {
    const entries = await reader.getEntries()
    expect(entries.map((e) => e.filename)).toEqual(input.map((i) => i.filename))
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]!
      if (entry.directory) throw new Error("unexpected directory")
      expect(await entry.getData(new Uint8ArrayWriter())).toEqual(
        new Uint8Array(await input[i]!.file.arrayBuffer())
      )
    }
  } finally {
    await reader.close()
  }
})
test("rejects an already cancelled export and can create an empty archive", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(createZip([], controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(
    (await createZip([], new AbortController().signal)).size
  ).toBeGreaterThan(0)
})
