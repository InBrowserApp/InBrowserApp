import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const snapshot = {
  schemaVersion: 1,
  updatedAt: "2026-11-17T07:25:40.000Z",
  organizations: [["Acme, Inc.", "Street"]],
  assignments: [
    ["MA-L", "AABBCC", 0],
    ["MA-M", "AABBCC1", 0],
  ],
}

describe("loadDatabase", () => {
  beforeEach(() => vi.resetModules())
  afterEach(() => vi.unstubAllGlobals())

  it("fetches one same-origin asset and expands the shared organization data", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(snapshot)))
    vi.stubGlobal("fetch", fetchMock)
    const { loadDatabase } = await import("../src/load")
    const promise = loadDatabase()
    expect(loadDatabase()).toBe(promise)
    await expect(promise).resolves.toEqual({
      updatedAt: snapshot.updatedAt,
      records: [
        {
          registry: "MA-L",
          assignment: "AABBCC",
          organization: "Acme, Inc.",
          address: "Street",
        },
        {
          registry: "MA-M",
          assignment: "AABBCC1",
          organization: "Acme, Inc.",
          address: "Street",
        },
      ],
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0]![0])).toMatch(
      /\/data\/registry\.json$/
    )
    expect(await loadDatabase()).toBe(await promise)
  })

  it("retries an HTTP failure without retaining the rejected promise", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(snapshot)))
    vi.stubGlobal("fetch", fetchMock)
    const { loadDatabase } = await import("../src/load")
    await expect(loadDatabase()).rejects.toThrow(
      "MAC registry could not be loaded"
    )
    await expect(loadDatabase()).resolves.toHaveProperty("updatedAt")
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("rejects unsupported snapshots and allows retry", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('{"schemaVersion":2}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(snapshot)))
    vi.stubGlobal("fetch", fetchMock)
    const { loadDatabase } = await import("../src/load")
    await expect(loadDatabase()).rejects.toThrow(
      "Unsupported MAC registry snapshot"
    )
    await expect(loadDatabase()).resolves.toHaveProperty("records")
  })

  it("retries a network failure", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("Network unavailable"))
      .mockResolvedValueOnce(new Response(JSON.stringify(snapshot)))
    vi.stubGlobal("fetch", fetchMock)
    const { loadDatabase } = await import("../src/load")
    await expect(loadDatabase()).rejects.toThrow("Network unavailable")
    await expect(loadDatabase()).resolves.toHaveProperty("records")
  })
})
