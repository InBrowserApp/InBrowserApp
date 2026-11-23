import type { ExtendedArchiveFormat } from "../core/formats"
import type { ArchiveEntry, ArchiveErrorCode } from "../core/types"

type ArchiveRequest = { id: number } & (
  | { type: "open"; file: File; format: ExtendedArchiveFormat }
  | { type: "extract"; index: number; path: string }
)

type ArchiveListing = {
  entries: ArchiveEntry[]
  tarWrapped: boolean
}

type ArchiveResponse = { id: number } & (
  | { type: "opened"; listing: ArchiveListing }
  | { type: "extracted"; blob: Blob }
  | { type: "error"; code: ArchiveErrorCode; message: string }
)

export type { ArchiveListing, ArchiveRequest, ArchiveResponse }
