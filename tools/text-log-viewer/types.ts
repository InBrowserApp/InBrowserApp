import type en from "./messages/en.json"
export type Messages = typeof en
export type Failure =
  | "unsupported"
  | "encodingError"
  | "binary"
  | "resourceLimit"
  | "readError"
export type Row = {
  line: number
  offset: number
  text: string
  continued: boolean
}
export type Section = { index: number; start: number; end: number; rows: Row[] }
export type Metadata = { encoding: string; lines: number; sections: number }
export type Match = {
  offset: number
  length: number
  line: number
  wrapped: boolean
}
export type Request = { id: number } & (
  | { kind: "open"; file: File; encoding: string }
  | { kind: "section"; index: number }
  | { kind: "end" }
  | { kind: "line"; line: number }
  | { kind: "search"; query: string; from: number; direction: 1 | -1 }
)
export type Response =
  | { id: number; error: Failure }
  | {
      id: number
      metadata: Metadata
      section: Section
      match?: Match | null
      target?: number
      end?: boolean
    }
