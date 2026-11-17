export const ENCODINGS = [
  ["utf-8", "UTF-8"],
  ["gbk", "GBK"],
  ["gb18030", "GB18030"],
  ["big5", "Big5"],
  ["utf-16le", "UTF-16LE"],
  ["utf-16be", "UTF-16BE"],
  ["shift_jis", "Shift_JIS"],
  ["euc-jp", "EUC-JP"],
  ["euc-kr", "EUC-KR"],
  ["windows-1252", "Windows-1252"],
  ["windows-1251", "Windows-1251"],
] as const

export type Encoding = (typeof ENCODINGS)[number][0]
export type SourceEncoding = Encoding | "auto"
export type BomPolicy = "remove" | "add" | "preserve"
export type LineEnding = "preserve" | "lf" | "crlf" | "cr"
export const PREVIEW_LENGTH = 12_000
export const SAMPLE =
  "Hello, world!\n简体中文 · 繁體中文\n日本語 · 한국어\nCafé · € · 😀\n"

export function isUnicode(encoding: Encoding) {
  return encoding === "utf-8" || encoding.startsWith("utf-16")
}

export function encodingLabel(encoding: Encoding) {
  return ENCODINGS.find(([value]) => value === encoding)![1]
}
