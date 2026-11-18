// @vitest-environment node
import { BlobReader, Uint8ArrayWriter, ZipReader } from "@zip.js/zip.js"
import { expect, it } from "vitest"
import { createZip } from "./zip"

it("archives original image bytes under Unicode timestamped filenames", async () => {
  const frames = [
    {
      time: 0,
      name: "影片-00-00.000.png",
      blob: new Blob([Uint8Array.of(1, 2)]),
    },
    {
      time: 1000,
      name: "影片-00-01.000.png",
      blob: new Blob([Uint8Array.of(3, 4)]),
    },
  ]
  const archive = await createZip(frames)
  expect(archive.type).toBe("application/zip")
  const reader = new ZipReader(new BlobReader(archive))
  try {
    const entries = await reader.getEntries()
    expect(entries.map((entry) => entry.filename)).toEqual(
      frames.map((frame) => frame.name)
    )
    for (const [index, entry] of entries.entries()) {
      if (!entry.directory) {
        expect(await entry.getData(new Uint8ArrayWriter())).toEqual(
          new Uint8Array(await frames[index]!.blob.arrayBuffer())
        )
      }
    }
  } finally {
    await reader.close()
  }
})
