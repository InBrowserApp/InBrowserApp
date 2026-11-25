import { BlobWriter, ZipWriter } from "@zip.js/zip.js"

export type CbzFile = {
  cbz: Blob
  total: number
  first: string
  last: string
  cover: Blob | null
}

export function createCbzWriter() {
  return new ZipWriter(new BlobWriter("application/vnd.comicbook+zip"), {
    level: 0,
    bufferedWrite: false,
    useWebWorkers: false,
  })
}
