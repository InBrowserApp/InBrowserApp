import type { Torrent } from "webtorrent"

// Verified WebTorrent signaling endpoints from ngosang/trackerslist's trackers_all_ws.txt.
const PUBLIC_TRACKERS = [
  "wss://tracker.webtorrent.dev",
  "wss://tracker.openwebtorrent.com",
]
const FALLBACK_DELAY_MS = 6_000

type Peer = Exclude<Parameters<Torrent["addPeer"]>[0], string>
type Tracker = {
  on(event: "peer", listener: (peer: Peer) => void): void
  on(event: "error", listener: () => void): void
  start(): void
  stop(): void
  destroy(): void
}
type TrackerConstructor = new (options: {
  peerId: string
  infoHash: string
  announce: string[]
  getAnnounceOpts: () => { downloaded: number; uploaded: number; left: number }
}) => Tracker

type DiscoverableTorrent = Torrent & {
  private?: boolean
  destroyed?: boolean
  discovery?: { tracker?: { constructor: TrackerConstructor } | null }
}

function schedulePublicTrackers(
  torrent: DiscoverableTorrent,
  peerId: string,
  originalTrackers: readonly string[],
  tryOriginalFirst: boolean
) {
  let tracker: Tracker | undefined
  const peers = new Set<Peer>()
  let closed = false

  function stop() {
    if (closed) return
    closed = true
    window.clearTimeout(timer)
    torrent.removeListener("metadata", enforcePrivacy)
    tracker?.stop()
    tracker?.destroy()
    if (!torrent.destroyed) {
      for (const peer of peers) torrent.removePeer(peer)
    }
    peers.clear()
  }

  function enforcePrivacy() {
    if (torrent.private) stop()
  }

  const timer = window.setTimeout(
    () => {
      if (
        torrent.private ||
        torrent.destroyed ||
        (torrent.metadata &&
          torrent.wires.some((wire) => {
            // Web seed wires are HTTP sources, not WebRTC peers.
            return (wire as { type?: string }).type !== "webSeed"
          }))
      )
        return
      const originals = new Set(
        originalTrackers.map((url) => new URL(url).href)
      )
      const announce = PUBLIC_TRACKERS.filter(
        (url) => !originals.has(new URL(url).href)
      )
      if (!announce.length) return

      // WebTorrent's browser bundle already contains the tracker client. Reuse it
      // so a fallback can run alongside the original discovery on the same torrent.
      const Tracker = torrent.discovery?.tracker?.constructor
      if (!Tracker) return

      tracker = new Tracker({
        announce,
        infoHash: torrent.infoHash,
        peerId,
        getAnnounceOpts: () => {
          const downloaded = torrent.destroyed ? 0 : torrent.downloaded
          return {
            downloaded,
            uploaded: torrent.uploaded,
            left: torrent.ready ? Math.max(0, torrent.length - downloaded) : 1,
          }
        },
      })
      tracker.on("error", stop)
      tracker.on("peer", (peer) => {
        if (closed || torrent.private || torrent.destroyed) {
          peer.destroy()
        } else if (torrent.addPeer(peer)) {
          peers.add(peer)
          peer.once("close", () => peers.delete(peer))
        }
      })
      tracker.start()
    },
    tryOriginalFirst ? FALLBACK_DELAY_MS : 0
  )
  torrent.on("metadata", enforcePrivacy)
  return stop
}

export { schedulePublicTrackers }
