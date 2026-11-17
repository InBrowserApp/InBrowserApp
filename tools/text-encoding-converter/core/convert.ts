import iconv from "iconv-lite"
import {
  isUnicode,
  type BomPolicy,
  type Encoding,
  type LineEnding,
} from "../config"
import {
  compareEncodings,
  decode,
  hasBinaryControls,
  lineEndings,
  preview,
} from "./decode"
import type { ConversionRequest, ConversionResult } from "../types"

function encode(text: string, target: Encoding, bom: boolean) {
  // iconv-lite supplies the legacy encoders missing from native TextEncoder.
  // Its substitutions and compatibility mappings must never silently change text.
  const encoded = iconv.encode(text, target, { addBOM: false })
  const restored = new TextDecoder(target, { ignoreBOM: true }).decode(encoded)
  const signature =
    target === "utf-8"
      ? [0xef, 0xbb, 0xbf]
      : target === "utf-16le"
        ? [0xff, 0xfe]
        : [0xfe, 0xff]
  const prefix = bom ? signature : []
  const bytes = new Uint8Array(prefix.length + encoded.length)
  bytes.set(prefix)
  bytes.set(encoded, prefix.length)
  return { bytes, restored }
}

export function normalizeLineEndings(text: string, ending: LineEnding) {
  if (ending === "preserve") return text
  const replacement = ending === "lf" ? "\n" : ending === "crlf" ? "\r\n" : "\r"
  return text.replace(/\r\n|\r|\n/g, replacement)
}

export function outputHasBom(
  target: Encoding,
  policy: BomPolicy,
  inputBom: boolean
) {
  return (
    isUnicode(target) &&
    (policy === "add" || (policy === "preserve" && inputBom))
  )
}

export function convertInput(
  input: Uint8Array | string,
  options: Omit<ConversionRequest, "input">
): ConversionResult {
  const source =
    typeof input === "string"
      ? {
          text: input.startsWith("\ufeff") ? input.slice(1) : input,
          encoding: "utf-8" as const,
          bom: input.startsWith("\ufeff") ? "utf-8" : null,
          error: hasBinaryControls(input) ? ("binary" as const) : null,
        }
      : decode(input, options.source)
  const result: ConversionResult = {
    sourceEncoding: source.encoding,
    sourceBom: source.bom,
    sourcePreview: preview(source.text),
    lineEndings: lineEndings(source.text),
    candidates: typeof input === "string" ? [] : compareEncodings(input),
    outputPreview: null,
    outputBom: outputHasBom(options.target, options.bom, source.bom !== null),
    hex: "",
    bytes: null,
    error: source.error,
  }
  if (result.error) return result
  const text = normalizeLineEndings(source.text, options.lineEnding)
  const { bytes, restored } = encode(text, options.target, result.outputBom)
  result.outputPreview = preview(restored)
  if (restored !== text) {
    result.error = "unrepresentable"
    return result
  }
  result.hex = Array.from(bytes.subarray(0, 64), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join(" ")
  result.bytes = bytes.buffer
  return result
}
