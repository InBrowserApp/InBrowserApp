import { describe, expect, it } from "vitest"

import { calculateCid, compareCid, DEFAULT_SETTINGS, kuboCommand } from "./cid"

const hello = new File(["hello\n"], "hello.txt")
const version0 = "QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN"

function calculateFile(file: File, options = DEFAULT_SETTINGS) {
  return calculateCid(
    { name: file.name, directory: false, files: [file] },
    options,
    new AbortController().signal
  )
}

describe("UnixFS CIDs from Kubo 0.43.1", () => {
  it("matches a small raw file and an empty file", async () => {
    expect(String(await calculateFile(hello))).toBe(
      "bafkreicysg23kiwv34eg2d7qweipxwosdo2py4ldv42nbauguluen5v6am"
    )
    expect(String(await calculateFile(new File([], "empty.txt")))).toBe(
      "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"
    )
  })

  it("matches files that span multiple blocks", async () => {
    const file = new File([new Uint8Array(524288)], "large.bin")
    expect(String(await calculateFile(file))).toBe(
      "bafybeig5axbv7uxiwv63kn6qvegw5vbz2tlgv4nhz4crv6g3f3rat7ttsi"
    )
  })

  it("matches legacy and wrapped imports", async () => {
    const legacy = await calculateFile(hello, {
      ...DEFAULT_SETTINGS,
      version: 0,
      rawLeaves: false,
    })
    expect(String(legacy)).toBe(version0)
    expect(compareCid(` ${legacy.toV1()} `, legacy)).toBe("match")
    expect(compareCid(String(await calculateFile(hello)), legacy)).toBe(
      "different"
    )
    expect(compareCid("hello.txt", legacy)).toBe("invalidCid")
    expect(
      String(await calculateFile(hello, { ...DEFAULT_SETTINGS, wrap: true }))
    ).toBe("bafybeigdcg7pksx2zk5336vrfsktjodlr4rbfz37qr3koc5xboxe5ekv24")
  })

  it("preserves nested paths", async () => {
    const folderHello = new File(["hello\n"], "hello.txt")
    const folderWorld = new File(["world\n"], "world.txt")
    Object.defineProperty(folderHello, "webkitRelativePath", {
      value: "docs/hello.txt",
    })
    Object.defineProperty(folderWorld, "webkitRelativePath", {
      value: "docs/sub/world.txt",
    })
    const result = await calculateCid(
      { name: "docs", directory: true, files: [folderWorld, folderHello] },
      DEFAULT_SETTINGS,
      new AbortController().signal
    )
    expect(String(result)).toBe(
      "bafybeie5c2xqxv72fokquxqckoo3equu5ifbxw2aoprbnycswjq7bqdjyu"
    )
  })
})

it("handles cancellation and empty selections", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(
    calculateCid(
      { name: hello.name, directory: false, files: [hello] },
      DEFAULT_SETTINGS,
      controller.signal
    )
  ).rejects.toHaveProperty("name", "AbortError")
  await expect(
    calculateCid(
      { name: "", directory: false, files: [] },
      DEFAULT_SETTINGS,
      new AbortController().signal
    )
  ).rejects.toThrow("No UnixFS root")
})

it("quotes the input path and reproduces options", () => {
  expect(
    kuboCommand(
      { name: "-a'b", directory: true, files: [hello] },
      { ...DEFAULT_SETTINGS, wrap: true }
    )
  ).toBe(
    `ipfs add --only-hash -Q --cid-version=1 --raw-leaves=true --chunker=size-262144 --recursive --hidden --empty-dirs=false --wrap-with-directory -- '-a'"'"'b'`
  )
})
