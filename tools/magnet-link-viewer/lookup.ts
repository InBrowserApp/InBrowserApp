import { readMagnet } from "@workspace/bittorrent"
import type { TorrentMetadata } from "@workspace/ui/components/tool/torrent-details"
import type { Torrent } from "webtorrent"

type MagnetLink = Awaited<ReturnType<typeof readMagnet>>

async function lookupMetadata(
  { identity, sources }: MagnetLink,
  signal: AbortSignal
) {
  const announce = identity.announce.filter((url) => /^wss?:\/\//i.test(url))
  if (!announce.length && !sources.length) {
    throw new Error("No browser-compatible discovery source")
  }

  const [{ default: WebTorrent }, { default: MemoryChunkStore }] =
    await Promise.all([
      import("webtorrent/dist/webtorrent.min.js"),
      import("memory-chunk-store"),
    ])
  signal.throwIfAborted()

  return new Promise<TorrentMetadata>((resolve, reject) => {
    const client = new WebTorrent({ dht: false, lsd: false, webSeeds: false })
    const onAbort = () => fail(signal.reason)

    function close() {
      signal.removeEventListener("abort", onAbort)
      if (!client.destroyed) client.destroy()
    }

    function fail(error: unknown) {
      reject(error)
      close()
    }

    client.on("error", fail)
    signal.addEventListener("abort", onAbort, { once: true })

    try {
      // Give WebTorrent only the protocol fields it needs for discovery.
      const torrent: Torrent & { private?: boolean } = client.add(
        { infoHash: identity.infoHash, announce, xs: sources },
        { deselect: true, store: MemoryChunkStore, storeCacheSlots: 0 }
      )
      torrent.on("error", fail)
      torrent.once("metadata", () => {
        resolve({
          infoHash: torrent.infoHash,
          name: torrent.name,
          files: torrent.files.map(({ path, length }) => ({ path, length })),
          length: torrent.length,
          pieceLength: torrent.pieceLength,
          pieceCount: torrent.pieces.length,
          announce: [...new Set([...identity.announce, ...torrent.announce])],
          urlList: [...new Set([...identity.urlList, ...torrent.urlList])],
          created: torrent.created,
          createdBy: torrent.createdBy,
          comment: torrent.comment,
          private: torrent.private,
        })
        close()
      })
    } catch (error) {
      fail(error)
    }
  })
}

export { lookupMetadata, readMagnet }
