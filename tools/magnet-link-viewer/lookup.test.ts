import { EventEmitter } from "node:events"
import { afterEach, expect, test, vi } from "vitest"
import { lookupMetadata, readMagnet } from "./lookup"

const instance = vi.hoisted(() => ({ client: vi.fn() }))

vi.mock("webtorrent/dist/webtorrent.min.js", () => ({
  default: class {
    constructor(options: unknown) {
      return instance.client(options)
    }
  },
}))

const hash = "08ada5a7a6183aae1e09d831df6748d566095a10"
const tracker = "wss://tracker.example.org"
const uri = `magnet:?xt=urn:btih:${hash}&tr=${tracker}&so=1&files=ignored`
const link = await readMagnet(uri)

function setupClient() {
  const torrent = Object.assign(new EventEmitter(), {
    infoHash: hash,
    files: [{ path: "Sintel/video.mp4", length: 1000 }],
    length: 1000,
    pieceLength: 1024,
    pieces: [null],
    announce: [],
    urlList: [],
  })
  const client = Object.assign(new EventEmitter(), {
    destroyed: false,
    destroy: vi.fn(),
    add: vi.fn(() => torrent),
  })
  instance.client.mockReturnValue(client)
  return { client, torrent }
}

afterEach(() => vi.resetAllMocks())

test("accepts trimmed case-insensitive scheme and a base32 info hash", async () => {
  const { magnet, identity } = await readMagnet(
    " MAGNET:?xt=urn:btih:BCW2LJ5GDOVODCENQM67M5ENKZQJ5EIK "
  )
  expect(magnet.startsWith("MAGNET:?")).toBe(true)
  expect(identity.infoHash).toMatch(/^[a-f0-9]{40}$/)
  await expect(readMagnet("magnet:?xt=urn:btmh:1220abcd")).rejects.toThrow(
    "Invalid BitTorrent info hash"
  )
})

test("only collects metadata and closes immediately", async () => {
  const { client, torrent } = setupClient()
  const result = lookupMetadata(link, new AbortController().signal)
  await vi.waitFor(() =>
    expect(client.add).toHaveBeenCalledWith(
      { infoHash: hash, announce: [tracker], xs: [] },
      expect.objectContaining({ deselect: true, store: expect.any(Function) })
    )
  )
  expect(instance.client).toHaveBeenCalledWith({
    dht: false,
    lsd: false,
    webSeeds: false,
  })
  torrent.emit("metadata")
  await expect(result).resolves.toMatchObject({
    infoHash: hash,
    files: [{ path: "Sintel/video.mp4", length: 1000 }],
    pieceCount: 1,
  })
  expect(client.destroy).toHaveBeenCalledOnce()
})

test("closes the client on cancel and avoids opening it for an already cancelled request", async () => {
  const { client } = setupClient()
  const controller = new AbortController()
  const result = lookupMetadata(link, controller.signal)
  await Promise.all([
    expect(result).rejects.toMatchObject({ name: "AbortError" }),
    vi
      .waitFor(() => expect(client.add).toHaveBeenCalledOnce())
      .then(() => controller.abort()),
  ])
  expect(client.destroy).toHaveBeenCalledOnce()
  await expect(lookupMetadata(link, controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(instance.client).toHaveBeenCalledOnce()
})

test("closes on torrent errors and when add throws", async () => {
  const { client, torrent } = setupClient()
  const failed = lookupMetadata(link, new AbortController().signal)
  await Promise.all([
    expect(failed).rejects.toThrow("unreachable"),
    vi
      .waitFor(() => expect(client.add).toHaveBeenCalledOnce())
      .then(() => torrent.emit("error", new Error("unreachable"))),
  ])
  client.add.mockImplementationOnce(() => {
    throw new Error("failed to add")
  })
  await expect(
    lookupMetadata(link, new AbortController().signal)
  ).rejects.toThrow("failed to add")
  expect(client.destroy).toHaveBeenCalledTimes(2)
})

test("keeps display values and ignores unknown parameters", async () => {
  const { identity } = await readMagnet(
    `magnet:?xt=URN%3ABTIH%3A${hash}&tr=wss://tracker.example.org/?a=b&files=ignored`
  )
  expect(identity).toEqual({
    infoHash: hash,
    name: undefined,
    announce: ["wss://tracker.example.org/?a=b"],
    urlList: [],
  })
})

test("skips network lookup for a torrent with only a UDP tracker", async () => {
  const udpOnly = await readMagnet(
    `magnet:?xt=urn:btih:${hash}&tr=udp://tracker.example.org`
  )
  await expect(
    lookupMetadata(udpOnly, new AbortController().signal)
  ).rejects.toThrow("discovery source")
  expect(instance.client).not.toHaveBeenCalled()
})
