const endpoints = [
  "https://ethereum-rpc.publicnode.com",
  "https://ethereum.drpc.org",
]

const methods = {
  "ERC-721": "c87b56dd",
  "ERC-1155": "0e89341c",
} as const

type TokenStandard = keyof typeof methods

export interface TokenUri {
  standard: TokenStandard
  uri: string
  resolvedUri: string
}

export function contractAddress(input: string): string | null {
  const address = input.trim()
  return /^0x[0-9a-f]{40}$/i.test(address) ? address.toLowerCase() : null
}

export function tokenNumber(input: string): bigint | null {
  const id = input.trim()
  if (!/^(?:\d{1,78}|0x[0-9a-f]{1,64})$/i.test(id)) return null
  const number = BigInt(id)
  return number < 1n << 256n ? number : null
}

function decodeUri(value: string): string | null {
  if (!/^0x(?:[0-9a-f]{2}){64,}$/i.test(value)) return null
  const head = BigInt(value.slice(0, 66))
  if (head !== 32n) return null
  const size = BigInt("0x" + value.slice(66, 130))
  if (size > BigInt((value.length - 130) / 2)) return null
  const data = value.slice(130, 130 + 2 * Number(size))
  const bytes = Uint8Array.from(data.match(/../g) ?? [], (pair) =>
    parseInt(pair, 16)
  )
  try {
    const uri = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
    return uri.trim() ? uri : null
  } catch {
    return null
  }
}

async function ethCall(
  endpoint: string,
  to: string,
  data: string,
  signal: AbortSignal,
  fetcher: typeof fetch
) {
  const response = await fetcher(endpoint, {
    method: "POST",
    credentials: "omit",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to, data: "0x" + data }, "latest"],
    }),
    signal,
  })
  if (!response.ok) throw new Error("RPC request failed")
  const responseBody = (await response.json()) as {
    result?: unknown
    error?: { code?: unknown; message?: unknown }
  } | null
  if (typeof responseBody?.result === "string") return responseBody.result
  const error = responseBody?.error
  if (
    error?.code === 3 ||
    (typeof error?.message === "string" &&
      /execution reverted|invalid opcode/i.test(error.message))
  ) {
    return "0x"
  }
  throw new Error("Ethereum RPC did not return a result")
}

export async function readTokenUri(
  address: string,
  id: bigint,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch
): Promise<TokenUri | null> {
  const hex = id.toString(16).padStart(64, "0")
  for (const endpoint of endpoints) {
    signal.throwIfAborted()
    const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(8000)])
    const call = (data: string) =>
      ethCall(endpoint, address, data, requestSignal, fetcher)
    try {
      // Prefer the ERC-1155 metadata extension when a contract exposes both methods.
      const flag = await call("01ffc9a7" + methods["ERC-1155"].padEnd(64, "0"))
      const is1155 = /^0x0{63}1$/i.test(flag)
      const order: TokenStandard[] = is1155
        ? ["ERC-1155", "ERC-721"]
        : ["ERC-721", "ERC-1155"]
      for (const standard of order) {
        const uri = decodeUri(await call(methods[standard] + hex))
        if (uri) {
          return {
            standard,
            uri,
            resolvedUri:
              standard === "ERC-1155" ? uri.replaceAll("{id}", hex) : uri,
          }
        }
      }
      return null
    } catch {
      signal.throwIfAborted()
    }
  }
  throw new Error("Ethereum RPC unavailable")
}
