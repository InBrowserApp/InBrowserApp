import { BlobReader, Uint8ArrayWriter, ZipReader } from "@zip.js/zip.js"
import { expect, it } from "vitest"
import { createArchive } from "./convert"
import { readImages } from "./images"

const png = new Uint8Array(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf1kAAAAASUVORK5CYII=",
    "base64"
  )
)

it("uses natural filename order, identifies image bytes, and reports unsupported files", async () => {
  const files = [
    new File([png], "page10.png"),
    new File([png], "page2"),
    new File(["not an image"], "fake.jpg"),
  ]
  const result = await readImages(files)
  expect(result.skipped).toBe(1)
  expect(result.images.map(({ path, extension }) => [path, extension])).toEqual(
    [
      ["page2", "png"],
      ["page10.png", "png"],
    ]
  )
})

it("retains the selected order and original bytes in numbered CBZ entries", async () => {
  const files = [
    new File([png, "first"], "b.png"),
    new File([png, "second"], "a.png"),
  ]
  const { images } = await readImages(files)
  images.reverse()
  const archive = await createArchive(
    images,
    new AbortController().signal,
    () => {}
  )
  const reader = new ZipReader(new BlobReader(archive), {
    useWebWorkers: false,
  })
  try {
    const entries = await reader.getEntries()
    expect(entries.map(({ filename }) => filename)).toEqual([
      "page-0001.png",
      "page-0002.png",
    ])
    for (const [index, entry] of entries.entries()) {
      if (entry.directory) throw new Error("Expected a comic page.")
      const bytes = await entry.getData(new Uint8ArrayWriter())
      expect(bytes).toEqual(new Uint8Array(await files[index]!.arrayBuffer()))
    }
  } finally {
    await reader.close()
  }
})
