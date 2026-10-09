import type { WebDocument } from "@workspace/web-document"
import type en from "./messages/en.json"

export type Messages = typeof en
export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "structure"
  | "email"
  | "resourceLimit"
export type ArchiveNotes = {
  truncated: boolean
  nested: boolean
  encoding: boolean
}
export type ConvertedArchive = {
  source: string
  location: string
  archiveNotes: ArchiveNotes
}
export type ArchiveDocument = WebDocument & Omit<ConvertedArchive, "source">
export type WorkerResult = { result: ConvertedArchive } | { error: Failure }
