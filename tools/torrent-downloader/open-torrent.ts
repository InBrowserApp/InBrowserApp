import { readMagnet } from "@workspace/bittorrent"
import type { Instance } from "parse-torrent"
import type { Torrent } from "webtorrent"
import { selectStore } from "./chunk-store"
import {
  schedulePublicTrackers,
  websocketTrackers,
} from "@workspace/bittorrent/public-trackers"

class InvalidTorrentError extends Error {}

function readFile(file: File, signal: AbortSignal) {
  return new Promise<Instance>((resolve, reject) => {
    signal.throwIfAborted()
    const worker = new Worker(
      new URL("./parse-torrent.worker.ts", import.meta.url),
      { type: "module" }
    )

    function finish(parsed: Instance | null) {
      signal.removeEventListener("abort", onAbort)
      worker.terminate()
      if (parsed) resolve(parsed)
      else reject(signal.aborted ? signal.reason : new InvalidTorrentError())
    }

    const onAbort = () => finish(null)
    signal.addEventListener("abort", onAbort, { once: true })
    worker.onmessage = (event: MessageEvent<Instance | null>) =>
      finish(event.data)
    worker.onerror = () => finish(null)
    try {
      worker.postMessage(file)
    } catch {
      finish(null)
    }
  })
}

const webSeeds = (urls: string[]) =>
  urls.filter((url) => /^https?:\/\//i.test(url))

async function readSource(
  input: string | File,
  signal: AbortSignal
): Promise<Instance> {
  if (typeof input !== "string") {
    const parsed = await readFile(input, signal)
    return {
      ...parsed,
      announce: websocketTrackers(parsed.announce),
      urlList: webSeeds(parsed.urlList ?? []),
    }
  }

  const magnet = await readMagnet(input).catch(() => {
    throw new InvalidTorrentError()
  })
  return {
    infoHash: magnet.identity.infoHash,
    announce: websocketTrackers(magnet.identity.announce),
    urlList: webSeeds(magnet.identity.urlList),
    xs: magnet.sources,
  }
}

async function openTorrent(
  input: string | File,
  signal: AbortSignal,
  disconnected: () => void,
  publicTrackers: boolean
) {
  const source = await readSource(input, signal)
  const [{ default: WebTorrent }, store] = await Promise.all([
    import("webtorrent/dist/webtorrent.min.js"),
    selectStore(signal),
  ])
  signal.throwIfAborted()
  const fallback =
    publicTrackers && !source.private && WebTorrent.WEBRTC_SUPPORT
  const originalTrackers = source.announce
  const hasOriginalDiscovery = Boolean(
    originalTrackers.length || source.xs?.length
  )
  if (!source.info && !hasOriginalDiscovery && !fallback) {
    throw new Error("No compatible source for metadata")
  }

  return new Promise<Torrent>((resolve, reject) => {
    const client = new WebTorrent({ dht: false, lsd: false })
    let ready = false

    const onAbort = () => fail(signal.reason)

    function fail(error: unknown) {
      signal.removeEventListener("abort", onAbort)
      if (!client.destroyed) client.destroy()
      if (!ready) reject(error)
      else if (!signal.aborted) disconnected()
    }

    signal.addEventListener("abort", onAbort, { once: true })
    client.on("error", fail)

    try {
      const torrent = client.add(source, {
        deselect: true,
        store,
        destroyStoreOnDestroy: true,
      })
      if (fallback) {
        // For a magnet, discovery starts in the same turn as the infoHash event.
        // A local file starts discovery when its storage is ready.
        torrent.once(source.info ? "ready" : "infoHash", () => {
          schedulePublicTrackers(
            torrent,
            client.peerId,
            originalTrackers,
            hasOriginalDiscovery
          )
        })
      }
      torrent.on("error", fail)
      torrent.once("ready", () => {
        ready = true
        resolve(torrent)
      })
    } catch (error) {
      fail(error)
    }
  })
}

export { InvalidTorrentError, openTorrent }
