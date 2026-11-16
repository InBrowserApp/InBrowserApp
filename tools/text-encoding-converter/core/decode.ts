import { PREVIEW_LENGTH, type Encoding, type SourceEncoding } from "../config"
import type { ConversionError } from "../types"

const SIGNATURES = [
  { encoding: "utf-32le", bytes: [0xff, 0xfe, 0, 0] },
  { encoding: "utf-32be", bytes: [0, 0, 0xfe, 0xff] },
  { encoding: "utf-8", bytes: [0xef, 0xbb, 0xbf] },
  { encoding: "utf-16le", bytes: [0xff, 0xfe] },
  { encoding: "utf-16be", bytes: [0xfe, 0xff] },
] as const

export function preview(text: string, length = PREVIEW_LENGTH) {
  const end = /[\uD800-\uDBFF]/u.test(text.charAt(length - 1))
    ? length - 1
    : length
  return text.slice(0, end)
}

export function hasBinaryControls(text: string) {
  // oxlint-disable-next-line no-control-regex -- Detect non-text binary control characters.
  return /[\u0000-\u0008\u000e-\u001f\u007f]/u.test(text)
}

export function lineEndings(text: string) {
  const counts = { lf: 0, crlf: 0, cr: 0 }
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\r") {
      if (text[i + 1] === "\n") {
        counts.crlf++
        i++
      } else {
        counts.cr++
      }
    } else if (text[i] === "\n") {
      counts.lf++
    }
  }
  return counts
}

export function decode(bytes: Uint8Array, source: SourceEncoding) {
  const signature = SIGNATURES.find((item) =>
    item.bytes.every((byte, index) => bytes[index] === byte)
  )
  const unsupported = signature?.encoding.startsWith("utf-32") === true
  const encoding: Encoding =
    source === "auto"
      ? !unsupported && signature
        ? (signature.encoding as Encoding)
        : "utf-8"
      : source
  const bom = signature?.encoding ?? null
  let error: ConversionError | null = unsupported ? "unsupportedBom" : null
  if (!error && signature && signature.encoding !== encoding)
    error = "bomMismatch"
  const body =
    signature?.encoding === encoding
      ? bytes.subarray(signature.bytes.length)
      : bytes
  let text: string
  try {
    text = new TextDecoder(encoding, { fatal: true, ignoreBOM: true }).decode(
      body
    )
  } catch {
    text = new TextDecoder(encoding, { ignoreBOM: true }).decode(body)
    error ??= source === "auto" && !signature ? "sourceUnknown" : "invalidBytes"
  }
  if (hasBinaryControls(text)) error ??= "binary"
  return { text, encoding, bom, error }
}

export function compareEncodings(bytes: Uint8Array) {
  const sample = bytes.subarray(0, 4096)
  return (["utf-8", "gbk", "big5", "shift_jis", "windows-1252"] as const).map(
    (encoding) => ({
      encoding,
      preview: preview(
        new TextDecoder(encoding).decode(sample, {
          stream: sample.length < bytes.length,
        }),
        240
      ),
    })
  )
}
