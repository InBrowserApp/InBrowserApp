import { CID } from "multiformats/cid"
import { identity } from "multiformats/hashes/identity"
import { expect, it, vi } from "vitest"

import fixture from "../fixtures/blocks.json"
import {
  addressView,
  entryView,
  gatewayStore,
  IpfsPathError,
  parseIpfsAddress,
} from "./gateway"

const blocks: Record<string, string> = fixture.blocks
const hello = "bafkreicysg23kiwv34eg2d7qweipxwosdo2py4ldv42nbauguluen5v6am"
const signal = new AbortController().signal

function fixtureResponse(url: string) {
  const cid = new URL(url).pathname.split("/").at(-1)!
  const data = blocks[cid]
  return data
    ? new Response(new Uint8Array(Buffer.from(data, "base64")))
    : new Response(null, { status: 404 })
}

async function read(
  cid: CID,
  fetcher: typeof fetch,
  options?: { signal: AbortSignal }
) {
  const chunks: Uint8Array[] = []
  for await (const chunk of gatewayStore(fetcher).get(cid, options))
    chunks.push(chunk)
  return chunks
}

it("accepts CID, immutable URI, path gateway and CID-subdomain addresses", () => {
  const root = fixture.root
  for (const text of [
    root,
    "/ipfs/" + root,
    `ipfs://${root}/`,
    `https://ipfs.example/ipfs/${root}?filename=x`,
    `https://${root}.ipfs.example/#section`,
  ]) {
    expect(parseIpfsAddress(text)?.cid.toString()).toBe(root)
  }
  expect(parseIpfsAddress(`ipfs://${root}/caf%C3%A9.txt`)?.parts).toEqual([
    "café.txt",
  ])
  expect(parseIpfsAddress(`https://ipfs.example/ipns/${root}`)).toBeNull()
  expect(parseIpfsAddress(`ipns://${root}`)).toBeNull()
  for (const part of ["..", ".", "%2F", "%5C", "%00", "%XY"]) {
    expect(parseIpfsAddress(`ipfs://${root}/${part}`)).toBeNull()
  }
})

it("verifies raw blocks and falls back after unavailable or modified responses", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(null, { status: 404 }))
    .mockImplementationOnce(async (url) => fixtureResponse(String(url)))
    .mockResolvedValueOnce(new Response("invalid bytes"))
    .mockImplementationOnce(async (url) => fixtureResponse(String(url)))
  const cid = CID.parse(hello)
  const expected = [new TextEncoder().encode("hello\n")]
  expect(await read(cid, fetcher, { signal })).toEqual(expected)
  expect(await read(cid, fetcher)).toEqual(expected)
  expect(fetcher.mock.calls[0]?.[1]?.headers).toEqual({
    Accept: "application/vnd.ipld.raw",
  })
  expect(String(fetcher.mock.calls[0]?.[0])).toContain("?format=raw")
})

it("distinguishes unreachable blocks, corrupt blocks and cancelled fetches", async () => {
  const cid = CID.parse(hello)
  const corrupt = vi
    .fn<typeof fetch>()
    .mockRejectedValueOnce(new TypeError("Unavailable"))
    .mockResolvedValueOnce(new Response("invalid bytes"))
  await expect(read(cid, corrupt)).rejects.toHaveProperty("code", "corrupt")
  const offline = vi
    .fn<typeof fetch>()
    .mockImplementation(async () => new Response(null, { status: 404 }))
  await expect(read(cid, offline)).rejects.toHaveProperty("code", "missing")
  const controller = new AbortController()
  controller.abort()
  await expect(
    read(cid, offline, { signal: controller.signal })
  ).rejects.toHaveProperty("name", "AbortError")
})

it("checks cancellation after a response and uses inline blocks locally", async () => {
  const controller = new AbortController()
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async (url) => {
    controller.abort()
    return fixtureResponse(String(url))
  })
  await expect(
    read(CID.parse(hello), fetcher, { signal: controller.signal })
  ).rejects.toHaveProperty("name", "AbortError")
  expect(fetcher).toHaveBeenCalledTimes(1)
  const inline = new TextEncoder().encode("inline")
  expect(
    await read(CID.createV1(0x55, identity.digest(inline)), fetcher)
  ).toEqual([inline])
  expect(fetcher).toHaveBeenCalledTimes(1)
})

it("resolves nested paths and distinguishes a nonexistent path", async () => {
  const store = gatewayStore(async (url) => fixtureResponse(String(url)))
  const root = await entryView(
    [{ name: "docs", cid: CID.parse(fixture.root) }],
    store,
    signal
  )
  expect(root.children.map(({ name }) => name)).toEqual(["hello.txt", "sub"])
  const file = await addressView(
    parseIpfsAddress(`ipfs://${fixture.root}/sub/world.txt`)!,
    store,
    signal
  )
  expect(file.path.at(-1)?.name).toBe("world.txt")
  expect(file.entry.type).toBe("raw")
  await expect(
    addressView(
      parseIpfsAddress(`ipfs://${fixture.root}/missing`)!,
      store,
      signal
    )
  ).rejects.toBeInstanceOf(IpfsPathError)
})

it("opens a reachable HAMT entry without enumerating unavailable sibling shards", async () => {
  const { default: hamt } = await import("../fixtures/hamt.json")
  const available: Record<string, string> = hamt.blocks
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async (url) => {
    const cid = new URL(String(url)).pathname.split("/").at(-1)!
    const block = available[cid]
    return block
      ? new Response(new Uint8Array(Buffer.from(block, "base64")))
      : new Response(null, { status: 404 })
  })
  const result = await addressView(
    parseIpfsAddress(`ipfs://${hamt.root}/${hamt.name}`)!,
    gatewayStore(fetcher),
    signal
  )
  expect(result.path.map(({ name }) => name)).toEqual([hamt.root, hamt.name])
  expect(result.entry.cid.toString()).toBe(hamt.leaf)
  expect(fetcher).toHaveBeenCalledTimes(2)
})

it("rejects an extra component after a file", async () => {
  await expect(
    addressView(
      parseIpfsAddress(`ipfs://${fixture.root}/hello.txt/extra`)!,
      gatewayStore(async (url) => fixtureResponse(String(url))),
      signal
    )
  ).rejects.toBeInstanceOf(IpfsPathError)
})
