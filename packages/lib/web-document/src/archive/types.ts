export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "structure"
  | "email"
  | "resourceLimit"
type ArchiveNotes = {
  truncated: boolean
  nested: boolean
  encoding: boolean
}
export type ConvertedArchive = {
  source: string
  location: string
  archiveNotes: ArchiveNotes
}
export type WorkerResult = { result: ConvertedArchive } | { error: Failure }
