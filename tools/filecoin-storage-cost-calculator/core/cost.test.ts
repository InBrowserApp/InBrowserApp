import { afterEach, expect, it, vi } from "vitest"

import { estimateCost, referenceRates } from "./cost"
import { fetchMainnetRates } from "./pricing"

const plan = {
  size: 1,
  unit: "TiB",
  days: 30,
  copies: 2,
  pieces: 1,
  batches: 1,
} as const
const signal = new AbortController().signal
const block = "0x645544"

afterEach(() => vi.unstubAllGlobals())

it("matches the official 1 TiB two-copy example and separates the reserve", () => {
  const quote = estimateCost(plan, referenceRates)!
  expect(quote.monthly).toBeCloseTo(5.24)
  expect(quote.term).toBeCloseTo(5.24)
  expect(quote.operations).toBeCloseTo(0.072)
  expect(quote.spending).toBeCloseTo(5.312)
  expect(quote.reserve).toBe(1)
})

it("prorates retention, converts binary units, and charges by batch and piece", () => {
  const quote = estimateCost(
    {
      ...plan,
      size: 256,
      unit: "GiB",
      days: 15,
      copies: 3,
      batches: 2,
      pieces: 6,
    },
    referenceRates
  )!
  expect(quote.monthly).toBeCloseTo(2.235)
  expect(quote.term).toBeCloseTo(1.1175)
  expect(quote.operations).toBeCloseTo(0.177)
  expect(quote.spending).toBeCloseTo(1.2945)
  expect(quote.reserve).toBe(1.5)
})

it.each([
  { size: Number.NaN },
  { size: 0 },
  { days: Number.POSITIVE_INFINITY },
  { days: 0 },
  { copies: 1.2 },
  { pieces: 0 },
  { batches: 2 },
  { size: Number.MAX_VALUE, unit: "PiB" as const },
])("rejects a non-computable estimate for %j", (override) => {
  expect(estimateCost({ ...plan, ...override }, referenceRates)).toBeNull()
})

it("reads a pinned mainnet block and decodes the official ABI pricing tuple", async () => {
  const data =
    "0x" +
    [
      0n,
      2_500_000_000_000_000_000n,
      120_000_000_000_000_000n,
      0n,
      0n,
      25_000_000_000_000_000n,
      8_000_000_000_000_000n,
      3_000_000_000_000_000n,
      0n,
      0n,
      500_000_000_000_000_000n,
      0n,
      0n,
      0n,
      0n,
      0n,
    ]
      .map((word) => word.toString(16).padStart(64, "0"))
      .join("")
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ result: block }))
    .mockResolvedValueOnce(Response.json({ result: data }))
  vi.stubGlobal("fetch", fetcher)
  await expect(fetchMainnetRates(signal)).resolves.toEqual({
    block: BigInt(block),
    rates: referenceRates,
  })
  expect(JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body))).toMatchObject({
    method: "eth_blockNumber",
    params: [],
  })
  expect(JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body))).toMatchObject({
    method: "eth_call",
    params: [
      { to: "0xcf184Ab1FD8D1a563054d30Aa1fFb08136998172", data: "0xb7029144" },
      block,
    ],
  })
})

it.each([
  [new Response(null, { status: 429 }), "Filecoin RPC unavailable"],
  [Response.json(null), "Invalid Filecoin RPC result"],
  [Response.json({ result: "n/a" }), "Invalid Filecoin RPC result"],
])("reports unusable RPC responses", async (response, message) => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response)
  await expect(fetchMainnetRates(signal, fetcher)).rejects.toThrow(message)
})

it("rejects an unexpected result shape from the pricing contract", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ result: block }))
    .mockResolvedValueOnce(Response.json({ result: "0x10" }))
  await expect(fetchMainnetRates(signal, fetcher)).rejects.toThrow(
    "Invalid Warm Storage price list"
  )
})
