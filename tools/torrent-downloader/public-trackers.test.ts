import { EventEmitter } from "node:events"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { schedulePublicTrackers } from "./public-trackers"

const start = vi.fn()
const stop = vi.fn()
const destroy = vi.fn()
const create = vi.fn()
const trackerEvents = new EventEmitter()

class Tracker {
  constructor(options: unknown) {
    create(options)
  }
  on = trackerEvents.on.bind(trackerEvents)
  start = start
  stop = stop
  destroy = destroy
}

function makeTorrent() {
  return Object.assign(new EventEmitter(), {
    announce: ["wss://tracker.webtorrent.dev:443/", "wss://original.example"],
    addPeer: vi.fn(() => true),
    removePeer: vi.fn(),
    private: false,
    destroyed: false,
    ready: false,
    wires: [] as { type: string }[],
    infoHash: "fixture",
    metadata: null as Uint8Array | null,
    discovery: { tracker: { constructor: Tracker } },
  })
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
  trackerEvents.removeAllListeners()
})

test("waits for the original trackers and removes duplicate fallback addresses", () => {
  const torrent = makeTorrent()
  const dispose = schedulePublicTrackers(
    torrent as unknown as Parameters<typeof schedulePublicTrackers>[0],
    "peer",
    torrent.announce,
    true
  )
  // URLs added to metadata after discovery starts are not active trackers.
  torrent.announce = ["wss://tracker.openwebtorrent.com"]
  torrent.wires.push({ type: "webrtc" }) // Connected without supplying metadata.
  vi.advanceTimersByTime(5_999)
  expect(start).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(create).toHaveBeenCalledWith(
    expect.objectContaining({
      announce: ["wss://tracker.openwebtorrent.com"],
      infoHash: "fixture",
      peerId: "peer",
    })
  )
  expect(start).toHaveBeenCalledOnce()
  dispose()
  expect(stop).toHaveBeenCalledOnce()
  expect(destroy).toHaveBeenCalledOnce()
})

test("starts immediately if there is no original source, and disconnects fallback peers if metadata is private", () => {
  const torrent = makeTorrent()
  torrent.announce = []
  const dispose = schedulePublicTrackers(
    torrent as unknown as Parameters<typeof schedulePublicTrackers>[0],
    "peer",
    [],
    false
  )
  vi.advanceTimersByTime(0)
  expect(start).toHaveBeenCalledOnce()
  const peer = new EventEmitter()
  trackerEvents.emit("peer", peer)
  expect(torrent.addPeer).toHaveBeenCalledWith(peer)
  torrent.private = true
  torrent.emit("metadata")
  expect(torrent.removePeer).toHaveBeenCalledWith(peer)
  dispose()
  expect(stop).toHaveBeenCalledOnce()
})

test("does not announce with a connected WebRTC peer, known private metadata, or a canceled session", () => {
  const connected = makeTorrent()
  connected.wires.push({ type: "webrtc" })
  connected.metadata = new Uint8Array()
  const privateTorrent = makeTorrent()
  privateTorrent.private = true
  const canceled = makeTorrent()
  const dispose = [connected, privateTorrent, canceled].map((torrent) =>
    schedulePublicTrackers(
      torrent as unknown as Parameters<typeof schedulePublicTrackers>[0],
      "peer",
      torrent.announce,
      true
    )
  )
  dispose[2]!()
  vi.runAllTimers()
  expect(create).not.toHaveBeenCalled()
  for (const close of dispose) close()
})
