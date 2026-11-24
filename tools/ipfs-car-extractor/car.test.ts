import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import {
  listIpfsDirectory,
  openIpfsEntry,
  readIpfsFile,
  zipIpfsDirectory,
} from "@workspace/ipfs-files"
import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js"
import { expect, it } from "vitest"

import { openCar } from "./car"

const fixture = new Uint8Array(
  readFileSync(resolve(__dirname, "fixtures/directory.car"))
)
const signal = new AbortController().signal

function archive(bytes = fixture) {
  return openCar(new File([bytes], "directory.car"), signal)
}

it("extracts a Kubo CAR and preserves nested paths when exporting ZIP", async () => {
  const { roots, store } = await archive()
  expect(String(roots[0])).toBe(
    "bafybeie5c2xqxv72fokquxqckoo3equu5ifbxw2aoprbnycswjq7bqdjyu"
  )
  const root = await openIpfsEntry(roots[0]!, store, signal)
  if (root.type !== "directory") throw new Error("Expected a directory")
  const files = await listIpfsDirectory(root, signal)
  expect(files.map(({ name }) => name)).toEqual(["hello.txt", "sub"])
  const hello = await openIpfsEntry(files[0]!.cid, store, signal)
  if (hello.type === "directory") throw new Error("Expected a file")
  expect(await (await readIpfsFile(hello, signal)).text()).toBe("hello\n")

  const zip = await zipIpfsDirectory(root, store, signal)
  const reader = new ZipReader(new BlobReader(zip))
  const entries = await reader.getEntries()
  expect(entries.map(({ filename }) => filename)).toEqual([
    "hello.txt",
    "sub/",
    "sub/world.txt",
  ])
  const world = entries.at(-1)!
  if (world.directory) throw new Error("Expected a file")
  expect(await world.getData(new TextWriter())).toBe("world\n")
  await reader.close()
})

it("reports missing blocks and modified blocks separately", async () => {
  const truncated = fixture.slice(0, -43)
  const modified = fixture.slice()
  modified[modified.length - 1]! ^= 255
  for (const [bytes, code] of [
    [truncated, "missing"],
    [modified, "corrupt"],
  ] as const) {
    const { roots, store } = await archive(bytes)
    const root = await openIpfsEntry(roots[0]!, store, signal)
    if (root.type !== "directory") throw new Error("Expected a directory")
    await expect(zipIpfsDirectory(root, store, signal)).rejects.toMatchObject({
      code,
      path: "sub/world.txt",
    })
  }
})

it("rejects invalid and cancelled archives", async () => {
  await expect(
    archive(new TextEncoder().encode("Invalid CAR"))
  ).rejects.toThrow(/unexpected|invalid/i)
  const cancelled = new AbortController()
  cancelled.abort()
  await expect(
    openCar(new File([fixture], "directory.car"), cancelled.signal)
  ).rejects.toHaveProperty("name", "AbortError")
})

it("reads the data payload of a CARv2 envelope", async () => {
  const bytes = new Uint8Array(51 + fixture.length)
  bytes.set([0x0a, 0xa1, 0x67, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x02])
  const header = new DataView(bytes.buffer)
  header.setBigUint64(27, 51n, true)
  header.setBigUint64(35, BigInt(fixture.length), true)
  bytes.set(fixture, 51)
  const { roots, store } = await archive(bytes)
  expect((await openIpfsEntry(roots[0]!, store, signal)).type).toBe("directory")
})
