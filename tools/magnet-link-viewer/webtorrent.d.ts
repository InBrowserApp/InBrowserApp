declare module "webtorrent/dist/webtorrent.min.js" {
  export { default } from "webtorrent"
}

declare module "memory-chunk-store" {
  import type { TorrentOptions } from "webtorrent"
  const MemoryChunkStore: NonNullable<TorrentOptions["store"]>
  export default MemoryChunkStore
}
