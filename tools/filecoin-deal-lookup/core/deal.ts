import { FilecoinRpcError, filecoinRpc } from "@workspace/filecoin-rpc"

type Status =
  | "active"
  | "pending"
  | "notActivated"
  | "expired"
  | "slashed"
  | "historical"

interface Terms {
  client: string
  provider: string
  cid: string
  size: number
  verified: boolean
  start: number
  end: number
}

export interface Deal extends Terms {
  id: number
  status: Status
  epoch?: number
  startsAt: number
  endsAt: number
}

interface Head {
  Height: number
  Cids: { "/": string }[]
  Blocks: { Timestamp: number }[]
}

interface MarketDeal {
  Proposal: {
    PieceCID: { "/": string }
    PieceSize: number
    VerifiedDeal: boolean
    Client: string
    Provider: string
    StartEpoch: number
    EndEpoch: number
  }
  State?: { SectorStartEpoch: number; SlashEpoch: number } | null
}

interface ArchivedDeal {
  id: number
  pieceCid: string
  pieceSize: number
  verifiedDeal: boolean
  client: string
  provider: string
  startEpoch: number
  endEpoch: number
  startTimestamp: number
  endTimestamp: number
}

export function parseDealId(input: string) {
  const text = input.trim()
  const id = Number(text)
  return /^\d+$/.test(text) && Number.isSafeInteger(id) ? id : null
}

function validTerms(terms: Terms) {
  if (
    ![terms.client, terms.provider, terms.cid].every(
      (value) => typeof value === "string" && value.length > 0
    ) ||
    ![terms.start, terms.end, terms.size].every(Number.isSafeInteger) ||
    typeof terms.verified !== "boolean"
  ) {
    throw new Error("Invalid storage deal record")
  }
  return terms
}

function currentStatus(
  terms: Terms,
  state: MarketDeal["State"],
  epoch: number
): Status {
  if ((state?.SlashEpoch ?? -1) >= 0) return "slashed"
  if (epoch >= terms.end) return "expired"
  if ((state?.SectorStartEpoch ?? -1) >= 0) return "active"
  return epoch > terms.start ? "notActivated" : "pending"
}

async function marketDeal(
  id: number,
  head: Head,
  signal: AbortSignal,
  fetcher: typeof fetch
): Promise<Deal | null> {
  let result: MarketDeal
  try {
    result = (await filecoinRpc(
      "Filecoin.StateMarketStorageDeal",
      [id, head.Cids],
      signal,
      fetcher
    )) as MarketDeal
  } catch (error) {
    signal.throwIfAborted()
    if (
      error instanceof FilecoinRpcError &&
      error.message.toLowerCase().includes(`deal ${id} not found`)
    ) {
      return null
    }
    throw error
  }

  const { Proposal: p, State: state } = result
  const terms = validTerms({
    cid: p.PieceCID["/"],
    size: p.PieceSize,
    verified: p.VerifiedDeal,
    client: p.Client,
    provider: p.Provider,
    start: p.StartEpoch,
    end: p.EndEpoch,
  })
  const dateAt = (epoch: number) =>
    head.Blocks[0]!.Timestamp + (epoch - head.Height) * 30
  return {
    ...terms,
    id,
    epoch: head.Height,
    status: currentStatus(terms, state, head.Height),
    startsAt: dateAt(terms.start),
    endsAt: dateAt(terms.end),
  }
}

async function archivedDeal(
  id: number,
  signal: AbortSignal,
  fetcher: typeof fetch
): Promise<Deal | null> {
  const response = await fetcher(`https://filfox.info/api/v1/deal/${id}`, {
    credentials: "omit",
    signal,
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error("Historical deal lookup unavailable")
  const data: ArchivedDeal = await response.json()
  if (
    data.id !== id ||
    !Number.isSafeInteger(data.startTimestamp) ||
    !Number.isSafeInteger(data.endTimestamp)
  ) {
    throw new Error("Invalid historical deal record")
  }
  return {
    ...validTerms({
      cid: data.pieceCid,
      size: data.pieceSize,
      verified: data.verifiedDeal,
      client: data.client,
      provider: data.provider,
      start: data.startEpoch,
      end: data.endEpoch,
    }),
    id,
    status: "historical",
    startsAt: data.startTimestamp,
    endsAt: data.endTimestamp,
  }
}

export async function lookupDeal(
  id: number,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch
): Promise<{ deal: Deal } | { problem: "missing" | "historyFailed" }> {
  const head = (await filecoinRpc(
    "Filecoin.ChainHead",
    [],
    signal,
    fetcher
  )) as Head | null
  if (
    !head ||
    !Number.isSafeInteger(head.Height) ||
    !Array.isArray(head.Cids) ||
    !head.Cids.length ||
    !Number.isSafeInteger(head.Blocks?.[0]?.Timestamp)
  ) {
    throw new Error("Invalid Filecoin chain head")
  }
  const current = await marketDeal(id, head, signal, fetcher)
  if (current) return { deal: current }

  try {
    const archived = await archivedDeal(id, signal, fetcher)
    return archived ? { deal: archived } : { problem: "missing" }
  } catch {
    if (signal.reason?.name !== "TimeoutError") signal.throwIfAborted()
    return { problem: "historyFailed" }
  }
}
