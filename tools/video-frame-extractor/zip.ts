import type { Frame } from "./types"

export async function createZip(
  frames: readonly Pick<Frame, "name" | "blob">[]
) {
  const { ZipWriter, BlobWriter, BlobReader } = await import("@zip.js/zip.js")
  const writer = new ZipWriter(new BlobWriter("application/zip"), {
    level: 0,
    bufferedWrite: false,
    useWebWorkers: false,
  })
  for (const { name, blob } of frames) {
    await writer.add(name, new BlobReader(blob))
  }
  return writer.close()
}
