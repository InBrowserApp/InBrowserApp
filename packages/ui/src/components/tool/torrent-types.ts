import type EnglishMessages from "./torrent-messages/en.json"

type TorrentMessages = typeof EnglishMessages

type TorrentIdentity = {
  infoHash: string
  name?: string
  announce?: string[]
  urlList?: string[]
}

type TorrentMetadata = TorrentIdentity & {
  files: { path: string; length: number }[]
  length: number
  pieceLength: number
  pieceCount: number
  created?: Date
  createdBy?: string
  comment?: string
  private?: boolean
}

export type { TorrentIdentity, TorrentMessages, TorrentMetadata }
