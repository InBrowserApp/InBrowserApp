import { CarReader } from "@ipld/car/reader"
import {
  listIpfsDirectory,
  openIpfsEntry,
  readIpfsFile,
  type ReadableStorage,
} from "@workspace/ipfs-files"
import { expect, it, vi } from "vitest"

import { buildCar, DuplicatePathError, UnsupportedFolderPathError } from "./car"

const signal = new AbortController().signal
const hello = new File(["hello\n"], "hello.txt")
const entry = { file: hello, path: hello.name }

async function readArchive(blob: Blob) {
  const reader = await CarReader.fromBytes(
    new Uint8Array(await blob.arrayBuffer())
  )
  const [cid] = await reader.getRoots()
  const store: ReadableStorage = {
    async *get(id) {
      const block = await reader.get(id)
      if (!block) throw new Error("Missing block")
      yield block.bytes
    },
  }
  return { cid: cid!, store, reader }
}

it("writes a CARv1 with a Kubo-compatible root and original bytes", async () => {
  const progress = vi.fn()
  const result = await buildCar([entry], signal, progress)
  const { cid, store, reader } = await readArchive(result.blob)
  expect(result.cid).toBe(
    "bafkreicysg23kiwv34eg2d7qweipxwosdo2py4ldv42nbauguluen5v6am"
  )
  expect(cid.toString()).toBe(result.cid)
  expect(reader.version).toBe(1)
  expect(progress).toHaveBeenCalledOnce()
  const file = await openIpfsEntry(cid, store, signal)
  if (file.type === "directory") throw new Error("Expected a file")
  expect(await (await readIpfsFile(file, signal)).text()).toBe("hello\n")
})

it("keeps nested paths and empty folders and writes repeated content once", async () => {
  const result = await buildCar(
    [
      { path: "docs" },
      { path: "docs/empty" },
      { path: "docs/sub/hello.txt", file: hello },
      { path: "docs/hello.txt", file: hello },
    ],
    signal,
    vi.fn()
  )
  const { cid, store, reader } = await readArchive(result.blob)
  const root = await openIpfsEntry(cid, store, signal)
  if (root.type !== "directory") throw new Error("Expected a directory")
  const children = await listIpfsDirectory(root, signal)
  expect(children.map(({ name }) => name)).toEqual([
    "empty",
    "hello.txt",
    "sub",
  ])
  const empty = await openIpfsEntry(children[0]!.cid, store, signal)
  if (empty.type !== "directory") throw new Error("Expected a directory")
  expect(await listIpfsDirectory(empty, signal)).toEqual([])
  const blocks = []
  for await (const block of reader.blocks()) blocks.push(block.cid.toString())
  expect(blocks.length).toBe(4)
})

it("wraps several files in one directory root", async () => {
  const result = await buildCar(
    [entry, { ...entry, path: "other.txt" }],
    signal,
    vi.fn()
  )
  const { cid, store } = await readArchive(result.blob)
  const root = await openIpfsEntry(cid, store, signal)
  if (root.type !== "directory") throw new Error("Expected a directory")
  expect(
    (await listIpfsDirectory(root, signal)).map(({ name }) => name)
  ).toEqual(["hello.txt", "other.txt"])
})

it("reports duplicate paths before writing", async () => {
  await expect(
    buildCar([entry, entry], signal, vi.fn())
  ).rejects.toBeInstanceOf(DuplicatePathError)
})

it("rejects folder paths the UnixFS importer would misinterpret", async () => {
  for (const path of ["folder\\/hello.txt", "folder//hello.txt"]) {
    await expect(
      buildCar([{ ...entry, path }], signal, vi.fn())
    ).rejects.toBeInstanceOf(UnsupportedFolderPathError)
  }
})

it("aborts during writing and rejects a changed input instead of exposing an invalid CAR", async () => {
  const controller = new AbortController()
  await expect(
    buildCar([entry], controller.signal, () => controller.abort())
  ).rejects.toHaveProperty("name", "AbortError")
  const mutable = new File(["hello\n"], "mutable.txt")
  const slice = mutable.slice.bind(mutable)
  let changed = false
  vi.spyOn(mutable, "slice").mockImplementation((start, end) =>
    changed ? new Blob(["world\n"]) : slice(start, end)
  )
  await expect(
    buildCar([{ file: mutable, path: mutable.name }], signal, () => {
      changed = true
    })
  ).rejects.toThrow("The input changed while creating the CAR")
})
