import type english from "./messages/en.json"
import type { BomPolicy, Encoding, LineEnding, SourceEncoding } from "./config"

export type Messages = { readonly [Key in keyof typeof english]: string }
export type ConversionError =
  | "sourceUnknown"
  | "invalidBytes"
  | "binary"
  | "unsupportedBom"
  | "bomMismatch"
  | "unrepresentable"

export type ConversionRequest = {
  input: File | string
  source: SourceEncoding
  target: Encoding
  bom: BomPolicy
  lineEnding: LineEnding
}

export type ConversionResult = {
  sourceEncoding: Encoding
  sourceBom: string | null
  sourcePreview: string
  lineEndings: { lf: number; crlf: number; cr: number }
  candidates: { encoding: Encoding; preview: string }[]
  outputPreview: string | null
  outputBom: boolean
  hex: string
  bytes: ArrayBuffer | null
  error: ConversionError | null
}

export type WorkerResponse = { result: ConversionResult } | { failed: true }
