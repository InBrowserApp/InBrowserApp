import type { TorrentOptions } from "webtorrent"
import type { ReadCallback, ReadOptions, WriteCallback } from "fsa-chunk-store"

type Store = NonNullable<TorrentOptions["store"]>

async function diskStore(signal: AbortSignal): Promise<Store> {
  const root = await navigator.storage.getDirectory()
  const directory = await root.getDirectoryHandle("torrent-downloader", {
    create: true,
  })
  const { default: FSAChunkStore } = await import("fsa-chunk-store")
  const name = crypto.randomUUID()
  const lockName = (key: string) => `torrent-downloader/${key}`
  let release!: () => void
  let acquired!: () => void
  const lease = new Promise<void>((resolve) => {
    release = resolve
  })
  const ready = new Promise<void>((resolve) => {
    acquired = resolve
  })
  const locked = navigator.locks.request(lockName(name), { signal }, () => {
    acquired()
    return lease
  })
  await Promise.race([ready, locked])
  signal.addEventListener("abort", release, { once: true })
  if (signal.aborted) {
    release()
    signal.throwIfAborted()
  }

  // Reclaim staging from crashed tabs while skipping leases held by live tabs.
  void (async () => {
    const entries = directory as FileSystemDirectoryHandle & {
      keys(): AsyncIterable<string>
    }
    for await (const key of entries.keys()) {
      if (key === name) continue
      await navigator.locks
        .request(lockName(key), { ifAvailable: true }, async (lock) => {
          if (lock) await directory.removeEntry(key, { recursive: true })
        })
        .catch(() => undefined)
    }
  })().catch(() => undefined)

  class DownloadStore extends FSAChunkStore {
    private readonly stored = new Set<number>()

    override put(index: number, bytes: Uint8Array, callback: WriteCallback) {
      return super.put(index, bytes, (error) => {
        if (!error) this.stored.add(index)
        callback(error)
      })
    }

    override async get(
      index: number,
      options: ReadOptions | ReadCallback,
      callback?: ReadCallback
    ) {
      if (this.stored.has(index)) return super.get(index, options, callback)
      // WebTorrent probes every piece at startup. A miss must not create a file.
      const respond = typeof options === "function" ? options : callback
      queueMicrotask(() =>
        respond?.(new Error("Chunk has not been downloaded"))
      )
      return undefined
    }
  }

  return function store(chunkLength, { length }) {
    return new DownloadStore(chunkLength, {
      length,
      name,
      rootDir: Promise.resolve(directory),
    })
  }
}

async function selectStore(signal: AbortSignal): Promise<Store> {
  try {
    if (
      typeof navigator.storage?.getDirectory === "function" &&
      navigator.locks
    )
      return await diskStore(signal)
  } catch {
    // Private browsing or storage settings can make OPFS unavailable.
    signal.throwIfAborted()
  }
  const { default: MemoryChunkStore } = await import("memory-chunk-store")
  return MemoryChunkStore
}

export { selectStore }
