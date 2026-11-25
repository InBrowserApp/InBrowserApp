import { BlobWriter, ZipWriter } from "@zip.js/zip.js"
import type { ComicPreview } from "./types"

export type CbzFile = ComicPreview & { cbz: Blob }

export function createCbzWriter() {
  return new ZipWriter(new BlobWriter("application/vnd.comicbook+zip"), {
    level: 0,
    bufferedWrite: false,
    useWebWorkers: false,
  })
}
