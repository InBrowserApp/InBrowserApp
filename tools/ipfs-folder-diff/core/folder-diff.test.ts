import { CID } from "multiformats/cid"
import { expect, it, vi } from "vitest"

import { gatewayStore, parseIpfsAddress } from "@workspace/ipfs-files/gateway"

import invalidPaths from "../fixtures/invalid-paths.json"
import fixture from "../fixtures/snapshots.json"
import { compareFolders } from "./folder-diff"

const address = (input: string) => parseIpfsAddress(input)!
const blocks: Record<string, string> = {
  ...fixture.blocks,
  ...invalidPaths.blocks,
}

function fixtureContext(
  hide: (cid: string) => boolean = () => false,
  signal = new AbortController().signal
) {
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async (url) => {
    const cid = new URL(String(url)).pathname.split("/").at(-1)!
    const data = blocks[cid]
    return data && !hide(cid)
      ? new Response(new Uint8Array(Buffer.from(data, "base64")))
      : new Response(null, { status: 404 })
  })
  return { fetcher, store: gatewayStore(fetcher), onPath: vi.fn(), signal }
}

const before = address(fixture.before)
const after = address(fixture.after)

it("compares actual UnixFS directories and skips unchanged branches and raw files", async () => {
  const context = fixtureContext()
  const result = await compareFolders(before, after, context)
  expect(result).toMatchObject({
    before: fixture.before,
    after: fixture.after,
    unchecked: [],
  })
  const paths = Object.fromEntries(
    result.changes.map(({ path, kind }) => [path, kind])
  )
  expect(paths).toEqual({
    "assets/logo.svg": "added",
    "docs/index.html": "changed",
    "docs/old.md": "removed",
    "docs/setup.md": "added",
    drafts: "removed",
    "README.md": "changed",
    shortcut: "changed",
    switched: "changed",
  })
  for (const change of result.changes) {
    expect(Boolean(change.before)).toBe(change.kind !== "added")
    expect(Boolean(change.after)).toBe(change.kind !== "removed")
  }
  const requested = context.fetcher.mock.calls.map(
    ([url]) => String(url).split("/").at(-1)!.split("?")[0]!
  )
  expect(requested.every((cid) => CID.parse(cid).code === 0x70)).toBe(true)
  expect(context.onPath.mock.calls.flat()).toEqual(
    expect.arrayContaining(["", "assets", "docs"])
  )
  expect(context.onPath).not.toHaveBeenCalledWith("stable")
})

it("compares subfolders reached through an IPFS path and an HTTP gateway URL", async () => {
  const left = address(`ipfs://${fixture.before}/docs`)
  const right = address(`https://example.org/ipfs/${fixture.after}/docs`)
  const result = await compareFolders(left, right, fixtureContext())
  expect(result.changes.map(({ path }) => path)).toEqual([
    "index.html",
    "old.md",
    "setup.md",
  ])
})

it("treats CIDv0 and CIDv1 folder aliases as the same subtree", async () => {
  const context = fixtureContext()
  const result = await compareFolders(
    before,
    { ...before, cid: before.cid.toV0() },
    context
  )
  expect(result.changes).toEqual([])
  expect(result.unchecked).toEqual([])
  expect(context.onPath).not.toHaveBeenCalled()
})

it("identifies a file input separately from an unavailable folder", async () => {
  await expect(
    compareFolders(
      before,
      address(`${fixture.after}/README.md`),
      fixtureContext()
    )
  ).rejects.toMatchObject({ side: "after", messageKey: "notFolder" })
  await expect(
    compareFolders(
      address(`${fixture.before}/absent-directory`),
      after,
      fixtureContext()
    )
  ).rejects.toMatchObject({ side: "before", messageKey: "unavailable" })
  await expect(
    compareFolders(
      before,
      after,
      fixtureContext((cid) => cid === fixture.after)
    )
  ).rejects.toMatchObject({ side: "after", messageKey: "unavailable" })
})

it("preserves verified changes when a changed directory block is missing", async () => {
  const context = fixtureContext(
    (cid) =>
      ![fixture.before, fixture.after].includes(cid) &&
      context.onPath.mock.lastCall?.[0] === "docs"
  )
  const result = await compareFolders(before, after, context)
  expect(result.unchecked).toEqual(["docs"])
  expect(result.changes.map(({ path }) => path)).toEqual(
    expect.arrayContaining(["assets/logo.svg", "README.md"])
  )
  expect(result.changes.some(({ path }) => path.startsWith("docs/"))).toBe(
    false
  )
})

it("marks the root unchecked when a shard of a directory listing is missing", async () => {
  const result = await compareFolders(
    address(fixture.sharded),
    after,
    fixtureContext()
  )
  expect(result.unchecked).toEqual([""])
  expect(result.changes).toEqual([])
})

it.each([
  ["duplicate", invalidPaths.before, invalidPaths.after],
  ["slash", invalidPaths.slashName, fixture.after],
  ["empty", invalidPaths.emptyName, fixture.after],
])("marks a directory with a %s name unchecked", async (_kind, left, right) => {
  const result = await compareFolders(
    address(left),
    address(right),
    fixtureContext()
  )
  expect(result.unchecked).toEqual([""])
  expect(result.changes).toEqual([])
})

it("propagates cancellation during opening or during traversal", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(
    compareFolders(before, after, fixtureContext(undefined, controller.signal))
  ).rejects.toHaveProperty("name", "AbortError")

  const traversal = new AbortController()
  const context = fixtureContext(undefined, traversal.signal)
  context.onPath.mockImplementation((path: string) => {
    if (path === "docs") traversal.abort()
  })
  await expect(compareFolders(before, after, context)).rejects.toHaveProperty(
    "name",
    "AbortError"
  )

  const listing = new AbortController()
  const atRoot = fixtureContext(undefined, listing.signal)
  atRoot.onPath.mockImplementation(() => listing.abort())
  await expect(
    compareFolders(address(fixture.sharded), after, atRoot)
  ).rejects.toHaveProperty("name", "AbortError")
})
