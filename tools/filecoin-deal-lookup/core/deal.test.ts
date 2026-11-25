import { afterEach, expect, it, vi } from "vitest"
import { lookupDeal, parseDealId } from "./deal"

const id = 133464300
const cid = "baga6ea4seaqcbo2r5co6wsiu6okx6qb5gtxpta3xeth5aahi3em6e6bjk7itgmy"
const head = {
  Height: 6575469,
  Cids: [{ "/": "head" }],
  Blocks: [{ Timestamp: 1795570470 }],
}
const proposal = {
  PieceCID: { "/": cid },
  PieceSize: 34359738368,
  Client: "f03634927",
  Provider: "f01518369",
  VerifiedDeal: true,
  StartEpoch: 6071987,
  EndEpoch: 7627187,
}
const state = { SectorStartEpoch: 6068392, SlashEpoch: -1 }
const historic = {
  id,
  pieceCid: cid,
  pieceSize: 34359738368,
  client: "f03634927",
  provider: "f01518369",
  verifiedDeal: true,
  startEpoch: 6071987,
  endEpoch: 7627187,
  startTimestamp: 1780466010,
  endTimestamp: 1827122010,
}
const signal = new AbortController().signal
const missing = () =>
  Response.json({ error: { message: `RPC error: deal ${id} not found` } })
const withHead = (value: unknown = head) =>
  vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ result: value }))
afterEach(() => vi.unstubAllGlobals())

it("accepts non-negative integer IDs without losing precision", () => {
  expect(parseDealId(" 001 ")).toBe(1)
  expect(parseDealId("0")).toBe(0)
  expect(parseDealId("1.3")).toBeNull()
  expect(parseDealId("1e5")).toBeNull()
  expect(parseDealId("9007199254740993")).toBeNull()
})

it("reads a live-shaped deal at a pinned tipset and derives its scheduled UTC times", async () => {
  const fetcher = withHead().mockResolvedValueOnce(
    Response.json({ result: { Proposal: proposal, State: state } })
  )
  vi.stubGlobal("fetch", fetcher)
  await expect(lookupDeal(id, signal)).resolves.toEqual({
    deal: {
      id,
      status: "active",
      epoch: head.Height,
      client: proposal.Client,
      provider: proposal.Provider,
      cid,
      verified: true,
      size: 34359738368,
      start: 6071987,
      end: 7627187,
      startsAt: 1780466010,
      endsAt: 1827122010,
    },
  })
  expect(fetcher).toHaveBeenCalledTimes(2)
  expect(JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body))).toMatchObject({
    method: "Filecoin.StateMarketStorageDeal",
    params: [id, head.Cids],
  })
})

it.each([
  [head.Height, { ...state, SlashEpoch: head.Height }, "slashed"],
  [proposal.EndEpoch, state, "expired"],
  [
    proposal.StartEpoch,
    { SectorStartEpoch: -1, SlashEpoch: -1 },
    "notActivated",
  ],
  [proposal.StartEpoch - 1, null, "pending"],
])(
  "identifies market status with observed epoch %d",
  async (epoch, dealState, status) => {
    const fetcher = withHead({ ...head, Height: epoch }).mockResolvedValueOnce(
      Response.json({ result: { Proposal: proposal, State: dealState } })
    )
    await expect(lookupDeal(id, signal, fetcher)).resolves.toMatchObject({
      deal: { status },
    })
  }
)

it("uses only historical wording for the Filfox fallback after an absent market record", async () => {
  const fetcher = withHead()
    .mockResolvedValueOnce(missing())
    .mockResolvedValueOnce(Response.json(historic))
  await expect(lookupDeal(id, signal, fetcher)).resolves.toMatchObject({
    deal: {
      id,
      status: "historical",
      startsAt: historic.startTimestamp,
      endsAt: historic.endTimestamp,
    },
  })
  expect(fetcher.mock.calls[2]?.[0]).toBe(
    `https://filfox.info/api/v1/deal/${id}`
  )
})

it.each([
  [new Response(null, { status: 404 }), "missing"],
  [new Response(null, { status: 503 }), "historyFailed"],
  [Response.json({ ...historic, id: 1 }), "historyFailed"],
  [Response.json({ ...historic, startTimestamp: null }), "historyFailed"],
  [Response.json({ ...historic, endTimestamp: "unknown" }), "historyFailed"],
])(
  "handles absent or unavailable archive results",
  async (response, problem) => {
    const fetcher = withHead()
      .mockResolvedValueOnce(missing())
      .mockResolvedValueOnce(response)
    await expect(lookupDeal(id, signal, fetcher)).resolves.toEqual({ problem })
  }
)

it.each([
  null,
  { ...head, Height: "unknown" },
  { ...head, Cids: null },
  { ...head, Cids: [] },
  { ...head, Blocks: [] },
  { ...head, Blocks: null },
])("requires a valid Filecoin tipset", async (candidate) => {
  await expect(lookupDeal(id, signal, withHead(candidate))).rejects.toThrow(
    "Invalid Filecoin chain head"
  )
})

it.each([
  { Client: "" },
  { Provider: 42 },
  { PieceSize: "0" },
  { VerifiedDeal: "maybe" },
])("rejects malformed storage terms", async (override) => {
  const fetcher = withHead().mockResolvedValueOnce(
    Response.json({ result: { Proposal: { ...proposal, ...override } } })
  )
  await expect(lookupDeal(id, signal, fetcher)).rejects.toThrow(
    "Invalid storage deal record"
  )
})

it("does not interpret an RPC error as proof of a missing deal", async () => {
  const fetcher = withHead().mockResolvedValueOnce(
    Response.json({ error: { message: "tipset unavailable" } })
  )
  await expect(lookupDeal(id, signal, fetcher)).rejects.toThrow(
    "tipset unavailable"
  )
  const unavailable = withHead().mockResolvedValueOnce(
    new Response(null, { status: 503 })
  )
  await expect(lookupDeal(id, signal, unavailable)).rejects.toThrow(
    "Filecoin RPC unavailable"
  )
})

it("propagates cancellation instead of trying another source", async () => {
  const controller = new AbortController()
  const fetcher = withHead().mockImplementationOnce(async () => {
    controller.abort()
    throw new TypeError("Cancelled")
  })
  await expect(
    lookupDeal(id, controller.signal, fetcher)
  ).rejects.toHaveProperty("name", "AbortError")
  expect(fetcher).toHaveBeenCalledTimes(2)

  const archive = new AbortController()
  const archiveFetcher = withHead()
    .mockResolvedValueOnce(missing())
    .mockImplementationOnce(async () => {
      archive.abort()
      throw new TypeError("Cancelled")
    })
  await expect(
    lookupDeal(id, archive.signal, archiveFetcher)
  ).rejects.toHaveProperty("name", "AbortError")
})
