import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js"

export async function readBook(file: File, signal: AbortSignal) {
  if (!/\.(?:fb2|fbz|fb2\.zip)$/i.test(file.name))
    throw new Error("unsupported")
  signal.throwIfAborted()
  if (/\.fb2$/i.test(file.name)) return new Uint8Array(await file.arrayBuffer())
  const zip = new ZipReader(new BlobReader(file))
  try {
    const entries = await zip.getEntries()
    signal.throwIfAborted()
    const books = entries
      .filter((entry) => !entry.directory)
      .filter((entry) => /\.fb2$/i.test(entry.filename))
    if (!books.length) throw new Error("noBook")
    if (books.length > 1) throw new Error("ambiguous")
    const entry = books[0]!
    if (entry.encrypted) throw new Error("protected")
    const blob = await entry.getData!(new BlobWriter(), {
      signal,
      checkSignature: true,
    })
    return new Uint8Array(await blob.arrayBuffer())
  } finally {
    await zip.close()
  }
}
