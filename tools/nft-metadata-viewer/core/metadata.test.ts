import { expect, it, vi } from "vitest"
import { readTokenMetadata } from "./metadata"
import type { TokenUri } from "./ethereum"

const signal = new AbortController().signal
const url = "https://example.org/metadata/1.json"
const erc721: TokenUri = { standard: "ERC-721", uri: url, resolvedUri: url }

it("preserves the JSON, resolves relative images and lists readable traits", async () => {
  const json = JSON.stringify({
    name: "<name>",
    description: "Description",
    image: "../images/1.png",
    attributes: [
      { trait_type: "Color", value: "Blue" },
      { value: 3 },
      { value: {} },
      null,
    ],
  })
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(json))
  await expect(readTokenMetadata(erc721, 1n, signal, fetcher)).resolves.toEqual(
    {
      metadata: {
        name: "<name>",
        description: "Description",
        json,
        image: "https://example.org/images/1.png",
        traits: [
          { label: "Color", value: "Blue" },
          { label: "", value: "3" },
        ],
      },
    }
  )
})

it("expands all ERC-1155 string values while preserving unresolved source JSON", async () => {
  const hex = "2a".padStart(64, "0")
  const json = JSON.stringify({
    name: "Token {id}",
    image:
      "ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4/{id}.png",
    properties: { id: "{id}", enabled: true, detail: { nested: "{id}" } },
  })
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(json))
  await expect(
    readTokenMetadata({ ...erc721, standard: "ERC-1155" }, 42n, signal, fetcher)
  ).resolves.toEqual({
    metadata: {
      name: `Token ${hex}`,
      description: "",
      json,
      image: `https://ipfs.filebase.io/ipfs/bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4/${hex}.png`,
      traits: [
        { label: "id", value: hex },
        { label: "enabled", value: "true" },
      ],
    },
  })
})

it("previews inline image data from on-chain JSON", async () => {
  const json = '{"name":"On chain","image":"data:image/svg+xml,%3Csvg%2F%3E"}'
  const uri =
    "data:application/json;base64," + Buffer.from(json).toString("base64")
  await expect(
    readTokenMetadata({ ...erc721, uri, resolvedUri: uri }, 1n, signal)
  ).resolves.toMatchObject({
    metadata: { json, image: "data:image/svg+xml,%3Csvg%2F%3E", traits: [] },
  })
})

it("accepts embedded SVG and ignores unsupported image URLs", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      Response.json({ image: "javascript:alert(1)", image_data: "<svg/>" })
    )
    .mockResolvedValueOnce(Response.json({ image: "data:text/html,<html>" }))
    .mockResolvedValueOnce(Response.json({ image: " " }))
  await expect(
    readTokenMetadata(erc721, 1n, signal, fetcher)
  ).resolves.toMatchObject({
    metadata: { image: "data:image/svg+xml,%3Csvg%2F%3E" },
  })
  for (let i = 0; i < 2; i++) {
    await expect(
      readTokenMetadata(erc721, 1n, signal, fetcher)
    ).resolves.toMatchObject({
      metadata: { image: null },
    })
  }
})

it("distinguishes unreadable, oversized and invalid JSON metadata", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(null, { status: 404 }))
    .mockRejectedValueOnce(new TypeError("Network issue"))
    .mockResolvedValueOnce(new Response(new Uint8Array(4 * 1024 * 1024 + 1)))
    .mockResolvedValueOnce(new Response("<html>"))
    .mockResolvedValueOnce(new Response("[]"))
  const problems = [
    { problem: "metadataFailed" },
    { problem: "metadataFailed" },
    { problem: "metadataTooLarge" },
    { problem: "invalidMetadata" },
    { problem: "invalidMetadata", json: "[]" },
  ]
  for (const problem of problems) {
    await expect(
      readTokenMetadata(erc721, 1n, signal, fetcher)
    ).resolves.toEqual(problem)
  }
})

it("propagates cancelled metadata requests", async () => {
  const controller = new AbortController()
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => {
    controller.abort()
    throw new TypeError("Cancelled")
  })
  await expect(
    readTokenMetadata(erc721, 1n, controller.signal, fetcher)
  ).rejects.toHaveProperty("name", "AbortError")
})
