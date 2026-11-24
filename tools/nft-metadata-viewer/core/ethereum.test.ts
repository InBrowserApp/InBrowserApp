import { afterEach, expect, it, vi } from "vitest"
import { contractAddress, readTokenUri, tokenNumber } from "./ethereum"

const address = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"
const signal = new AbortController().signal
const probe = "0x01ffc9a7" + "0e89341c".padEnd(64, "0")
const yes = "0x" + "1".padStart(64, "0")

function abi(input: string | Uint8Array) {
  const bytes = Buffer.from(
    typeof input === "string" ? new TextEncoder().encode(input) : input
  )
  const data = bytes.toString("hex")
  return (
    "0x" +
    "20".padStart(64, "0") +
    bytes.length.toString(16).padStart(64, "0") +
    data.padEnd(Math.ceil(data.length / 64) * 64, "0")
  )
}

function callData(init: RequestInit | undefined) {
  const body = JSON.parse(String(init?.body))
  expect(body).toMatchObject({
    jsonrpc: "2.0",
    method: "eth_call",
    params: [{ to: address }, "latest"],
  })
  return body.params[0].data as string
}

afterEach(() => vi.unstubAllGlobals())

it("accepts valid addresses and the uint256 range in decimal and hex", () => {
  const max = (1n << 256n) - 1n
  expect(contractAddress(` ${address.toUpperCase()} `)).toBe(address)
  expect(contractAddress("0x1")).toBeNull()
  expect(tokenNumber(" 0x2A ")).toBe(42n)
  expect(tokenNumber("0")).toBe(0n)
  expect(tokenNumber(max.toString())).toBe(max)
  for (const invalid of ["", "-1", "1.0", "1e9", "0x", (max + 1n).toString()]) {
    expect(tokenNumber(invalid)).toBeNull()
  }
})

it("reads ERC-721 tokenURI at latest and keeps its exact string", async () => {
  const uri = "ipfs://bafyexample/42"
  const fetcher = vi
    .fn<typeof fetch>()
    .mockImplementation(async (_endpoint, init) => {
      expect(init?.method).toBe("POST")
      expect(init?.credentials).toBe("omit")
      return Response.json({
        result: callData(init) === probe ? "0x00" : abi(uri),
      })
    })
  vi.stubGlobal("fetch", fetcher)
  await expect(readTokenUri(address, 42n, signal)).resolves.toEqual({
    standard: "ERC-721",
    uri,
    resolvedUri: uri,
  })
  expect(callData(fetcher.mock.calls[1]?.[1])).toBe(
    "0xc87b56dd" + "2a".padStart(64, "0")
  )
})

it("prefers ERC-1155 metadata where supported and resolves its template", async () => {
  const uri = "https://example.com/{id}.json"
  const hex = "2a".padStart(64, "0")
  const fetcher = vi
    .fn<typeof fetch>()
    .mockImplementation(async (_endpoint, init) => {
      const data = callData(init)
      if (data === probe) return Response.json({ result: yes })
      expect(data).toBe("0x0e89341c" + hex)
      return Response.json({ result: abi(uri) })
    })
  await expect(readTokenUri(address, 42n, signal, fetcher)).resolves.toEqual({
    standard: "ERC-1155",
    uri,
    resolvedUri: `https://example.com/${hex}.json`,
  })
})

it("tries uri when interface detection and tokenURI revert", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      Response.json({ error: { code: 3, message: "Reverted" } })
    )
    .mockResolvedValueOnce(
      Response.json({ error: { code: -32000, message: "execution reverted" } })
    )
    .mockResolvedValueOnce(
      Response.json({ result: abi("https://example.org/0") })
    )
  await expect(
    readTokenUri(address, 0n, signal, fetcher)
  ).resolves.toMatchObject({
    standard: "ERC-1155",
  })
  expect(callData(fetcher.mock.calls[2]?.[1])).toBe(
    "0x0e89341c" + "0".repeat(64)
  )
})

it("fails over to another provider when the first fails", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(null, { status: 429 }))
    .mockResolvedValueOnce(Response.json({ result: "0x00" }))
    .mockResolvedValueOnce(
      Response.json({ result: abi("https://example.com/1") })
    )
  await expect(
    readTokenUri(address, 1n, signal, fetcher)
  ).resolves.toMatchObject({
    standard: "ERC-721",
  })
  expect(fetcher.mock.calls[0]?.[0]).not.toBe(fetcher.mock.calls[1]?.[0])
})

it.each([
  "0x",
  abi("unexpected offset").replace(/^0x0{62}20/, "0x" + "40".padStart(64, "0")),
  abi("short payload").slice(0, 130),
  abi(""),
  abi(" "),
  abi(Uint8Array.of(255)),
])(
  "treats an empty or invalid contract return as missing URI",
  async (value) => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => Response.json({ result: value }))
    await expect(readTokenUri(address, 0n, signal, fetcher)).resolves.toBeNull()
    expect(fetcher).toHaveBeenCalledTimes(3)
  }
)

it("distinguishes communication errors from missing token URIs", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      Response.json({ error: { code: -32005, message: "Rate limited" } })
    )
    .mockResolvedValueOnce(Response.json(null))
  await expect(readTokenUri(address, 9n, signal, fetcher)).rejects.toThrow(
    "Ethereum RPC unavailable"
  )
})

it("propagates cancellation without trying another provider", async () => {
  const controller = new AbortController()
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => {
    controller.abort()
    throw new TypeError("cancelled")
  })
  await expect(
    readTokenUri(address, 9n, controller.signal, fetcher)
  ).rejects.toHaveProperty("name", "AbortError")
  expect(fetcher).toHaveBeenCalledTimes(1)
})
