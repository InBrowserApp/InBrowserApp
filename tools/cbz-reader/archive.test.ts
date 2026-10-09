// @vitest-environment node
import { readFile } from "node:fs/promises"
import {
  BlobReader,
  BlobWriter,
  ZipReader,
  ZipWriter,
  Uint8ArrayReader,
} from "@zip.js/zip.js"
import { expect, test } from "vitest"
import { openComic } from "./archive"

const signal = () => new AbortController().signal
async function fixture(name: string) {
  return new File(
    [await readFile(new URL(`./fixtures/${name}.cbz`, import.meta.url))],
    `${name}.cbz`
  )
}

test("reads actual compressed pages lazily, filters metadata and preserves problem slots", async () => {
  const book = await openComic(await fixture("representative"), signal())
  expect(book.pages).toHaveLength(11)
  expect(book.pages.slice(0, 3).map((p) => p.name)).toEqual([
    "chapter2/page0.png",
    "chapter2/page1.png",
    "chapter2/page2.jpg",
  ])
  expect(book.pages[8]!.status).toBe("unsupportedPage")
  expect(book.pages[9]!.status).toBe("unsupportedPage")
  await expect(book.read(0, signal())).rejects.toThrow("Unsupported image")
  expect((await book.read(1, signal())).type).toBe("image/png")
  expect((await book.read(2, signal())).type).toBe("image/jpeg")
  expect((await book.read(3, signal())).type).toBe("image/webp")
  expect((await book.read(4, signal())).type).toBe("image/gif")
  expect((await book.read(5, signal())).type).toBe("image/bmp")
  expect((await book.read(6, signal())).type).toBe("image/avif")
  await book.dispose()
})

test("does not impose a page-count limit", async () => {
  const book = await openComic(await fixture("long"), signal())
  expect(book.pages).toHaveLength(1201)
  expect(book.pages.at(-1)!.name).toBe("page1201.png")
  expect((await book.read(1200, signal())).type).toBe("image/png")
  await book.dispose()
})

test("handles empty, corrupt, disguised SVG and cancellation", async () => {
  const empty = await openComic(await fixture("empty"), signal())
  expect(empty.pages).toEqual([])
  await empty.dispose()
  await expect(openComic(await fixture("corrupt"), signal())).rejects.toThrow(
    Error
  )
  const svg = await openComic(await fixture("disguised-svg"), signal())
  await expect(svg.read(0, signal())).rejects.toThrow("Unsupported image")
  const aborted = new AbortController()
  aborted.abort()
  await expect(svg.read(0, aborted.signal)).rejects.toThrow(Error)
  await expect(
    openComic(await fixture("empty"), aborted.signal)
  ).rejects.toThrow(Error)
  await svg.dispose()
})

test("identifies real encrypted entries without requesting or retaining a password", async () => {
  const writer = new ZipWriter(new BlobWriter(), { useWebWorkers: false })
  await writer.add(
    "page1.png",
    new Uint8ArrayReader(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])),
    { password: "fixture-only" }
  )
  const book = await openComic(
    new File([await writer.close()], "protected.cbz"),
    signal()
  )
  expect(book.pages[0]!.status).toBe("encryptedPage")
  await book.dispose()
})

test("checks CRC signatures before displaying extracted images", async () => {
  const writer = new ZipWriter(new BlobWriter(), {
    level: 0,
    useWebWorkers: false,
  })
  await writer.add(
    "page.png",
    new Uint8ArrayReader(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]))
  )
  const bytes = new Uint8Array(await (await writer.close()).arrayBuffer())
  const inspection = new ZipReader(new BlobReader(new Blob([bytes])))
  const entry = (await inspection.getEntries())[0]!
  const data = new DataView(bytes.buffer)
  const offset =
    entry.offset +
    30 +
    data.getUint16(entry.offset + 26, true) +
    data.getUint16(entry.offset + 28, true)
  bytes[offset + 7] = 11
  await inspection.close()
  const book = await openComic(new File([bytes], "crc.cbz"), signal())
  await expect(book.read(0, signal())).rejects.toThrow(Error)
  await book.dispose()
})

test("accepts AVIF compatible brands beyond the first sixteen bytes", async () => {
  const book = await openComic(await fixture("avif-compatible"), signal())
  expect((await book.read(0, signal())).type).toBe("image/avif")
  await book.dispose()
})
