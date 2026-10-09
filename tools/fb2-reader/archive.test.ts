// @vitest-environment jsdom
import { File as NodeFile, Blob as NodeBlob } from "node:buffer"
import { readFile } from "node:fs/promises"
import { BlobWriter, TextReader, ZipWriter, configure } from "@zip.js/zip.js"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { readBook } from "./archive"

beforeEach(() => {
  vi.stubGlobal("Blob", NodeBlob)
  vi.stubGlobal("File", NodeFile)
  configure({ useWebWorkers: false })
})
afterEach(() => vi.unstubAllGlobals())
const signal = () => new AbortController().signal
async function zip(entries: [string, string][], password?: string) {
  const writer = new ZipWriter(new BlobWriter(), { useWebWorkers: false })
  for (const [name, text] of entries)
    await writer.add(name, new TextReader(text), { password })
  return new File([await writer.close()], "archive.fbz")
}

test("opens the single book in a genuine FBZ and accepts the fb2.zip alias", async () => {
  const compressed = await readFile("tools/fb2-reader/fixtures/reading.fbz")
  const direct = await readFile("tools/fb2-reader/fixtures/reading.fb2")
  for (const name of ["reading.fbz", "reading.fb2.zip", "READING.FBZ"]) {
    const bytes = await readBook(new File([compressed], name), signal())
    expect(new TextDecoder().decode(bytes)).toBe(direct.toString())
  }
})
test("explains an empty archive, unrelated contents, ambiguous books, and encrypted books", async () => {
  await expect(readBook(await zip([]), signal())).rejects.toThrow("noBook")
  await expect(
    readBook(await zip([["cover.txt", "cover"]]), signal())
  ).rejects.toThrow("noBook")
  await expect(
    readBook(
      await zip([
        ["a.fb2", "one"],
        ["b.FB2", "two"],
      ]),
      signal()
    )
  ).rejects.toThrow("ambiguous")
  await expect(
    readBook(await zip([["book.fb2", "secret"]], "password"), signal())
  ).rejects.toThrow("protected")
})
test("does not cap the number of ZIP entries and ignores directory names", async () => {
  const entries: [string, string][] = Array.from({ length: 1001 }, (_, i) => [
    `extra/${i}.txt`,
    "x",
  ])
  entries.push(["book.fb2", "readable"])
  expect(
    new TextDecoder().decode(await readBook(await zip(entries), signal()))
  ).toBe("readable")
})
test("rejects unsupported filenames, damaged ZIPs, and cancelled reads", async () => {
  await expect(
    readBook(new File(["text"], "book.txt"), signal())
  ).rejects.toThrow("unsupported")
  await expect(
    readBook(new File(["not a zip"], "book.fbz"), signal())
  ).rejects.toThrow("File format is not recognized")
  const controller = new AbortController()
  controller.abort()
  await expect(
    readBook(new File(["text"], "book.fb2"), controller.signal)
  ).rejects.toThrow("aborted")
})
