import type { Rates } from "./cost"

const endpoint = "https://api.node.glif.io/rpc/v1"
const priceList = {
  to: "0xcf184Ab1FD8D1a563054d30Aa1fFb08136998172",
  data: "0xb7029144", // getPriceList()
}

async function request(
  method: string,
  params: readonly unknown[],
  fetcher: typeof fetch,
  signal: AbortSignal
) {
  const response = await fetcher(endpoint, {
    method: "POST",
    credentials: "omit",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal,
  })
  if (!response.ok) throw new Error("Filecoin RPC unavailable")
  const data: { result?: unknown } | null = await response.json()
  const result = data?.result
  if (typeof result !== "string" || !/^0x[0-9a-f]+$/i.test(result)) {
    throw new Error("Invalid Filecoin RPC result")
  }
  return result
}

export async function fetchMainnetRates(
  signal: AbortSignal,
  fetcher: typeof fetch = fetch
): Promise<{ block: bigint; rates: Rates }> {
  const block = await request("eth_blockNumber", [], fetcher, signal)
  const data = await request("eth_call", [priceList, block], fetcher, signal)

  // The deployed StateView returns token, rates, fees and lockups as 16 ABI words.
  if (data.length !== 2 + 16 * 64)
    throw new Error("Invalid Warm Storage price list")
  const amount = (word: number) =>
    Number(BigInt("0x" + data.slice(2 + word * 64, 2 + (word + 1) * 64))) / 1e18

  return {
    block: BigInt(block),
    rates: {
      storage: amount(1),
      proving: amount(2),
      create: amount(5),
      addBatch: amount(6),
      addPiece: amount(7),
      reserve: amount(10),
    },
  }
}
