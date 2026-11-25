export class FilecoinRpcError extends Error {}

export async function filecoinRpc(
  method: string,
  params: readonly unknown[],
  signal: AbortSignal,
  fetcher: typeof fetch = fetch
): Promise<unknown> {
  const response = await fetcher("https://api.node.glif.io/rpc/v1", {
    method: "POST",
    credentials: "omit",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal,
  })
  if (!response.ok) throw new Error("Filecoin RPC unavailable")
  const body: { result?: unknown; error?: { message?: unknown } } | null =
    await response.json()
  if (typeof body?.error?.message === "string") {
    throw new FilecoinRpcError(body.error.message)
  }
  return body?.result
}
