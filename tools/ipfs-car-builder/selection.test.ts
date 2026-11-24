import { expect, it, vi } from "vitest"

import { dropSource } from "./selection"

function directory(path: string, ...pages: FileSystemEntry[][]) {
  return {
    fullPath: path,
    isFile: false,
    createReader: () => ({
      readEntries: (resolve: (entries: FileSystemEntry[]) => void) =>
        resolve(pages.shift() ?? []),
    }),
  } as unknown as FileSystemDirectoryEntry
}

it("reads all dropped folder batches and includes empty subfolders", async () => {
  const file = new File(["hello"], "file.txt")
  const leaf = {
    fullPath: "/docs/file.txt",
    isFile: true,
    file: (resolve: (file: File) => void) => resolve(file),
  } as unknown as FileSystemFileEntry
  const root = directory("/docs", [leaf], [directory("/docs/empty")])
  const transfer = {
    files: [],
    items: [{ webkitGetAsEntry: () => root }, { webkitGetAsEntry: () => null }],
  } as unknown as DataTransfer
  expect(await dropSource(transfer)(new AbortController().signal)).toEqual([
    { path: "docs" },
    { path: "docs/file.txt", file },
    { path: "docs/empty" },
  ])
})

it("can cancel folder reads before visiting the next entry", async () => {
  const controller = new AbortController()
  const file = vi.fn()
  const leaf = { fullPath: "/docs/leaf", isFile: true, file }
  const root = {
    fullPath: "/docs",
    isFile: false,
    createReader: () => ({
      readEntries(resolve: (entries: unknown[]) => void) {
        controller.abort()
        resolve([leaf])
      },
    }),
  }
  const transfer = {
    files: [],
    items: [{ webkitGetAsEntry: () => root }],
  } as unknown as DataTransfer
  await expect(dropSource(transfer)(controller.signal)).rejects.toHaveProperty(
    "name",
    "AbortError"
  )
  expect(file).not.toHaveBeenCalled()
})
