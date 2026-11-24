import { importer, type WritableStorage } from "ipfs-unixfs-importer"
import { fixedSize } from "ipfs-unixfs-importer/chunker"
import type { CID } from "multiformats/cid"

export type ImportSettings = {
  version: 0 | 1
  chunkSize: number
  rawLeaves: boolean
  wrap: boolean
}

export type UnixFsSource = { path: string; file?: File }

export const DEFAULT_SETTINGS: ImportSettings = {
  version: 1,
  chunkSize: 262144,
  rawLeaves: true,
  wrap: false,
}

const discard: WritableStorage = {
  async put(cid) {
    return cid
  },
}

async function* readChunks(file: File, size: number, signal: AbortSignal) {
  for (let start = 0; start < file.size; start += size) {
    signal.throwIfAborted()
    yield new Uint8Array(await file.slice(start, start + size).arrayBuffer())
  }
}

export async function importUnixFs(
  sources: readonly UnixFsSource[],
  settings: ImportSettings,
  signal: AbortSignal,
  store = discard
) {
  const candidates = sources.map(({ path, file }) =>
    file
      ? { path, content: readChunks(file, settings.chunkSize, signal) }
      : { path }
  )
  let root: CID | undefined
  for await (const entry of importer(candidates, store, {
    profile: "unixfs-v0-2015",
    cidVersion: settings.version,
    rawLeaves: settings.rawLeaves,
    chunker: fixedSize({ chunkSize: settings.chunkSize }),
    fileImportConcurrency: 4,
    blockWriteConcurrency: 4,
    wrapWithDirectory: settings.wrap,
  })) {
    signal.throwIfAborted()
    root = entry.cid
  }
  if (!root) throw new Error("No UnixFS root")
  return root
}
