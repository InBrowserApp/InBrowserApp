import { expect, test, vi } from "vitest"
import { ArchiveError, type ArchiveEntry } from "@workspace/archive/types"
import { openWorkerArchive } from "@workspace/archive/worker"
import { openCompressedComic } from "./compressed"

vi.mock("@workspace/archive/worker", () => ({ openWorkerArchive: vi.fn() }))

const file = new File([], "comic.cb7")
const png = new Blob([Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10)])
const signal = new AbortController().signal

function comicWith(
  readEntry: (path: string) => Promise<Blob>,
  options?: Parameters<typeof openCompressedComic>[3]
) {
  const entries = [
    ["chapter10/1.png", "file"],
    ["chapter2/10.png", "file"],
    ["chapter2/2.png", "file"],
    [".hidden.png", "file"],
    ["ComicInfo.xml", "file"],
    ["linked.png", "symlink"],
    ["directory.png", "directory"],
  ].map(([path, kind]) => ({
    path,
    kind,
    size: 0,
    compressedSize: null,
    modifiedAt: null,
    extension: "",
  })) as ArchiveEntry[]
  const dispose = vi.fn(async () => {})
  vi.mocked(openWorkerArchive).mockResolvedValue({
    format: "7z",
    entries,
    readEntry,
    dispose,
  })
  return { comic: openCompressedComic(file, "7z", signal, options), dispose }
}

test("opens the selected archive format and reads only indexed raster pages", async () => {
  const readEntry = vi.fn(async () => png)
  const options = { preservePaths: true, sequentialReads: true }
  const { comic, dispose } = comicWith(readEntry, options)
  const book = await comic
  expect(openWorkerArchive).toHaveBeenCalledWith(file, "7z", signal, options)
  expect(book.pages.map(({ name }) => name)).toEqual([
    "chapter2/2.png",
    "chapter2/10.png",
    "chapter10/1.png",
  ])
  expect((await book.read(0, signal)).type).toBe("image/png")
  expect(readEntry).toHaveBeenCalledWith("chapter2/2.png")
  readEntry.mockResolvedValueOnce(new Blob(["<svg/>"]))
  await expect(book.read(1, signal)).rejects.toThrow(
    "Unsupported image encoding"
  )
  readEntry.mockRejectedValueOnce(
    new ArchiveError("entry-too-large", "too large")
  )
  await expect(book.read(1, signal)).rejects.toThrow(RangeError)
  await book.dispose()
  expect(dispose).toHaveBeenCalledOnce()
})

test("skips canceled page reads while an extraction is in progress", async () => {
  let finish!: (blob: Blob) => void
  const first = new Promise<Blob>((resolve) => {
    finish = resolve
  })
  const readEntry = vi.fn(async () => png).mockReturnValueOnce(first)
  const book = await comicWith(readEntry).comic
  const canceled = new AbortController()
  const current = book.read(0, signal)
  const skipped = book.read(1, canceled.signal)
  const next = book.read(2, signal)
  await Promise.resolve()
  expect(readEntry).toHaveBeenCalledTimes(1)
  canceled.abort()
  finish(png)
  await current
  await expect(skipped).rejects.toThrow(/abort/i)
  await next
  expect(readEntry.mock.calls).toEqual([
    ["chapter2/2.png"],
    ["chapter10/1.png"],
  ])
})
