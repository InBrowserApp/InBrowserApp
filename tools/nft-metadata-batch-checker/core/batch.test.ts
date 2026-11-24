import { describe, expect, it, vi } from "vitest"

import fixture from "../fixtures/ipfs.json"
import { checkBatch } from "./batch"

const base = new URL("https://example.org/metadata/1.json")
const image = "data:image/svg+xml,%3Csvg%2F%3E"
const sample = { name: " Moon ", image }
const blocks: Record<string, string> = fixture.blocks

function file(name: string, data: unknown) {
  return { source: name, file: new File([JSON.stringify(data)], name) }
}

function options() {
  return {
    signal: new AbortController().signal,
    checkMedia: false,
    localFiles: new Set<string>(),
    completeFolder: false,
    onProgress: vi.fn(),
  }
}

describe("browser batch checking", () => {
  it("checks relative media in a selected folder and leaves individual files unconfirmed", async () => {
    const fetcher = vi.fn<typeof fetch>()
    const paths = ["collection/metadata/1.json", "collection/image name.jpg"]
    const item = file(paths[0]!, {
      ...sample,
      image: "../image%20name.jpg",
      animation_url: "missing.mp4",
    })
    const config = {
      ...options(),
      checkMedia: true,
      localFiles: new Set(paths),
      fetcher,
    }
    const complete = await checkBatch([item], {
      ...config,
      completeFolder: true,
    })
    expect(complete[0]?.issues).toEqual([
      { code: "missingMedia", field: "animation_url" },
    ])
    expect((await checkBatch([item], config))[0]?.issues).toEqual([
      { code: "unverifiedMedia", field: "animation_url" },
    ])
    expect(fetcher).not.toHaveBeenCalled()
  })

  it("classifies media probe failures without losing valid item details", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      const path = new URL(String(input)).pathname
      if (path === "/metadata/1.json") {
        const response = Response.json({
          ...sample,
          image: "render.png",
          animation_url: "https://media.org/clip",
        })
        Object.defineProperty(response, "url", {
          value: "https://edge.example.org/releases/1.json",
        })
        return response
      }
      if (path === "/clip") throw new TypeError("Network unavailable")
      if (path === "/releases/render.png")
        return new Response(null, { status: 404 })
      if (path === "/ok") return new Response(null, { status: 200 })
      if (path === "/gone") return new Response(null, { status: 410 })
      if (path.startsWith("/ipfs/")) return new Response(null, { status: 404 })
      return new Response(null, { status: 405 })
    })
    const items = [
      { source: base.href },
      file("2.json", {
        ...sample,
        image: "https://media.org/ok",
        animation_url: "https://media.org/gone",
      }),
      file("3.json", {
        ...sample,
        image: `ipfs://${fixture.root}/image.png`,
        animation_url: "https://media.org/reject",
      }),
      file("4.json", { ...sample, image: "bad%ZZ.png" }),
      file("5.json", sample),
    ]
    const config = { ...options(), checkMedia: true, fetcher }
    const results = await checkBatch(items, config)
    expect(
      results.map(({ name, issues }) => [name, issues.map(({ code }) => code)])
    ).toEqual([
      ["Moon", ["missingMedia", "unverifiedMedia"]],
      ["Moon", ["missingMedia"]],
      ["Moon", ["unverifiedMedia", "unverifiedMedia"]],
      ["Moon", ["unverifiedMedia"]],
      ["Moon", []],
    ])
    expect(
      fetcher.mock.calls.filter(([, request]) => request?.method === "HEAD")
    ).toHaveLength(6)
    expect(config.onProgress.mock.calls.flat()).toEqual([1, 2, 3, 4, 5])
  })

  it("handles inline metadata, unavailable and oversized remote and local responses", async () => {
    const data = `data:application/json,${encodeURIComponent(JSON.stringify(sample))}`
    const valid = await checkBatch([{ source: data }], options())
    expect(valid[0]).toMatchObject({ name: "Moon", issues: [] })
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      const path = new URL(String(input)).pathname
      if (path === "/large")
        return new Response(
          new ReadableStream({
            start(stream) {
              stream.enqueue(new Uint8Array(4 * 1024 * 1024 + 1))
            },
            cancel() {
              throw new Error("Cancellation failed after bytes were read")
            },
          })
        )
      if (path === "/empty") return new Response(null, { status: 204 })
      if (path === "/missing") return new Response(null, { status: 404 })
      throw new TypeError("Could not fetch")
    })
    const config = { ...options(), fetcher }
    const results = await checkBatch(
      [
        { source: "invalid" },
        { source: "data:text/plain,hello" },
        { source: "https://example.org/large" },
        { source: "https://example.org/empty" },
        { source: "https://example.org/missing" },
        { source: "https://example.org/error" },
        {
          source: "oversized.json",
          file: new File(
            [new Uint8Array(4 * 1024 * 1024 + 1)],
            "oversized.json"
          ),
        },
      ],
      config
    )
    expect(results.map(({ issues }) => issues[0]?.code)).toEqual([
      "badUri",
      "badUri",
      "tooLarge",
      "invalidJson",
      "unavailable",
      "unavailable",
      "tooLarge",
    ])
  })

  it("reads verified IPFS metadata and rejects missing, oversized, and directory sources", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      const cid = new URL(String(input)).pathname.split("/").at(-1)!
      return blocks[cid]
        ? new Response(new Uint8Array(Buffer.from(blocks[cid], "base64")))
        : new Response(null, { status: 404 })
    })
    const root = `ipfs://${fixture.root}`
    const results = await checkBatch(
      [
        { source: `${root}/1.json` },
        { source: `${root}/gone.json` },
        { source: root },
        { source: `ipfs://${fixture.large}` },
      ],
      { ...options(), fetcher }
    )
    expect(results.map(({ name, issues }) => [name, issues[0]?.code])).toEqual([
      ["IPFS Moon", undefined],
      [undefined, "unavailable"],
      [undefined, "unavailable"],
      [undefined, "tooLarge"],
    ])
  })

  it("cancels an in-flight media request without returning a stale report", async () => {
    const controller = new AbortController()
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => {
      controller.abort()
      throw new TypeError("Cancelled")
    })
    const config = {
      ...options(),
      fetcher,
      checkMedia: true,
      signal: controller.signal,
    }
    await expect(
      checkBatch(
        [file("1.json", { ...sample, image: "https://example.org/media" })],
        config
      )
    ).rejects.toHaveProperty("name", "AbortError")
    expect(config.onProgress).not.toHaveBeenCalled()
  })
})
