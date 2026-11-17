import { describe, expect, it, vi } from "vitest"

import { captureDrop, readDrop, readFolder, selectFiles } from "./selection"
import { addItems } from "./collection"

import type { FolderHandle } from "./selection"

const signal = () => new AbortController().signal
const file = new File(["hello"], "hello.txt")
const fileEntry = (name = file.name): FileSystemEntry =>
  ({
    isFile: true,
    isDirectory: false,
    name,
    file: (resolve: (value: File) => void) => resolve(file),
  }) as unknown as FileSystemEntry
function directory(
  name: string,
  batches: FileSystemEntry[][]
): FileSystemEntry {
  return {
    isDirectory: true,
    isFile: false,
    name,
    createReader: () => ({
      readEntries: (resolve: (items: FileSystemEntry[]) => void) =>
        resolve(batches.shift() ?? []),
    }),
  } as unknown as FileSystemEntry
}
const data = (items: unknown[], files: File[] = []) =>
  ({ items, files }) as unknown as DataTransfer

describe("file and folder selection", () => {
  it("keeps same-named folders from different dropped roots separate", async () => {
    const selected = await readDrop(
      [
        {
          entry: directory("Photos", [
            [fileEntry("a.txt")],
            [directory("empty", [])],
          ]),
          file: null,
        },
        { entry: directory("Photos", [[fileEntry("b.txt")]]), file: null },
      ],
      signal()
    )
    const { items, adjusted } = addItems([], selected)
    expect(adjusted).toBe(true)
    expect(items.map((item) => item.path)).toContain("Photos/a.txt")
    expect(items.map((item) => item.path)).toContain("Photos (2)/b.txt")
    expect(items.map((item) => item.path)).toContain("Photos/empty")
  })
  it("preserves folder picker relative paths and zero-byte files", () => {
    const nested = new File([], "empty.txt")
    Object.defineProperty(nested, "webkitRelativePath", {
      value: "folder/nested/empty.txt",
    })
    expect(selectFiles([file, nested])).toEqual([
      { path: "hello.txt", file },
      { path: "folder/nested/empty.txt", file: nested },
    ])
  })

  it("captures entries synchronously and ignores non-file drag data", async () => {
    const getEntry = vi.fn(() => fileEntry())
    const getFile = vi.fn(() => file)
    const captured = captureDrop(
      data([
        { kind: "string" },
        { kind: "file", webkitGetAsEntry: getEntry, getAsFile: getFile },
      ])
    )
    expect(getEntry).toHaveBeenCalledOnce()
    expect(getFile).toHaveBeenCalledOnce()
    expect(await readDrop(captured, signal())).toEqual([
      { path: "hello.txt", file, root: 0 },
    ])
  })

  it("supports the plain file fallbacks without directory entry APIs", async () => {
    for (const transfer of [
      data([], [file]),
      data([{ kind: "file", getAsFile: () => file }]),
      data([
        { kind: "file", webkitGetAsEntry: () => null, getAsFile: () => file },
      ]),
    ]) {
      expect(await readDrop(captureDrop(transfer), signal())).toEqual([
        { path: file.name, file, root: 0 },
      ])
    }
  })

  it("drains every directory batch, retains nested and empty folders in mixed drops", async () => {
    const entries = Array.from({ length: 205 }, (_, i) => fileEntry(`${i}.txt`))
    const root = directory("root", [
      entries.slice(0, 100),
      entries.slice(100, 200),
      entries.slice(200),
      [directory("empty", []), directory("nested", [[fileEntry()]])],
    ])
    const result = await readDrop(
      [
        { entry: root, file: null },
        { entry: null, file },
      ],
      signal()
    )
    expect(result.filter((item) => item.file)).toHaveLength(207)
    expect(result).toContainEqual({ path: "root/empty", file: null, root: 0 })
    expect(result).toContainEqual({
      path: "root/nested/hello.txt",
      file,
      root: 0,
    })
  })

  it("rejects unavailable entries, non-file drops and read failures instead of silently omitting data", async () => {
    await expect(readDrop([], signal())).rejects.toThrow("No readable")
    await expect(
      readDrop([{ entry: null, file: null }], signal())
    ).rejects.toThrow("Unreadable")
    const badFile = {
      isFile: true,
      file: (_resolve: unknown, reject: (error: Error) => void) =>
        reject(new Error("denied")),
    } as unknown as FileSystemEntry
    await expect(
      readDrop([{ entry: badFile, file: null }], signal())
    ).rejects.toThrow("denied")
    const badFolder = {
      isFile: false,
      createReader: () => ({
        readEntries: (_resolve: unknown, reject: (error: Error) => void) =>
          reject(new Error("denied")),
      }),
    } as unknown as FileSystemEntry
    await expect(
      readDrop([{ entry: badFolder, file: null }], signal())
    ).rejects.toThrow("denied")
  })

  it("stops traversing when cancellation happens during a file read", async () => {
    const controller = new AbortController()
    const aborting = {
      isFile: true,
      file: (resolve: (value: File) => void) => {
        controller.abort()
        resolve(file)
      },
    } as unknown as FileSystemEntry
    await expect(
      readDrop([{ entry: aborting, file: null }], controller.signal)
    ).rejects.toMatchObject({ name: "AbortError" })
    await expect(
      readDrop([{ entry: null, file }], controller.signal)
    ).rejects.toMatchObject({ name: "AbortError" })
  })

  it("walks modern directory handles, including completely empty folders", async () => {
    const empty: FolderHandle = {
      kind: "directory",
      name: "empty",
      values: async function* () {},
    }
    const root: FolderHandle = {
      kind: "directory",
      name: "root",
      values: async function* () {
        yield empty
        yield { kind: "file", name: file.name, getFile: async () => file }
      },
    }
    expect(await readFolder(root, signal())).toEqual([
      { path: "root", file: null },
      { path: "root/empty", file: null },
      { path: "root/hello.txt", file },
    ])
    const controller = new AbortController()
    const aborting: FolderHandle = {
      ...root,
      values: async function* () {
        controller.abort()
        yield empty
      },
    }
    await expect(readFolder(aborting, controller.signal)).rejects.toMatchObject(
      { name: "AbortError" }
    )
    await expect(readFolder(empty, controller.signal)).rejects.toMatchObject({
      name: "AbortError",
    })
  })
})
