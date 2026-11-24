import parseTorrent, { toMagnetURI } from "parse-torrent"
import type { TorrentMetadata } from "@workspace/ui/components/tool/torrent-details"

type TorrentResult = { torrent: TorrentMetadata; magnet: string }
type WorkerReply = TorrentResult | null

async function readTorrent(file: Blob): Promise<TorrentResult> {
  const parsed = await parseTorrent(new Uint8Array(await file.arrayBuffer()))
  const { files, length, pieceLength, pieces } = parsed

  if (!files || length === undefined || !pieceLength || !pieces) {
    throw new Error("Missing torrent metadata")
  }

  return {
    torrent: {
      infoHash: parsed.infoHash,
      name: parsed.name,
      announce: parsed.announce,
      urlList: parsed.urlList,
      created: parsed.created,
      createdBy: parsed.createdBy,
      comment: parsed.comment,
      private: parsed.private,
      files: files.map(({ path, length }) => ({ path, length })),
      length,
      pieceLength,
      pieceCount: pieces.length,
    },
    magnet: toMagnetURI(parsed),
  }
}

export { readTorrent }
export type { TorrentResult, WorkerReply }
