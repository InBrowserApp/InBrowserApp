import { zipSync } from "fflate"
import type { ExtractedImage } from "./pdf-images"

export async function makeZip(images: ExtractedImage[]) {
  const files = await Promise.all(
    images.map(
      async ({ name, blob }) =>
        [name, new Uint8Array(await blob.arrayBuffer())] as const
    )
  )
  // JPEG and PNG already use compression.
  return new Blob([zipSync(Object.fromEntries(files), { level: 0 })], {
    type: "application/zip",
  })
}
