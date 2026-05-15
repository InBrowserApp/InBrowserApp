import type { ArchiveEntry } from "./types"

const MAX_TEXT_PREVIEW_BYTES = 1024 * 1024

const TEXT_EXTENSIONS = new Set([
  "bash",
  "conf",
  "css",
  "csv",
  "html",
  "ini",
  "js",
  "json",
  "jsx",
  "log",
  "md",
  "mjs",
  "plist",
  "sh",
  "sql",
  "toml",
  "ts",
  "tsx",
  "txt",
  "xml",
  "yaml",
  "yml",
  "zsh",
])

const IMAGE_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "ico",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "tif",
  "tiff",
  "webp",
])

const PDF_MIME_TYPE = "application/pdf"

const PREVIEW_LANGUAGE_BY_EXTENSION: Record<string, string> = {
  bash: "bash",
  conf: "ini",
  css: "css",
  csv: "plaintext",
  html: "xml",
  ini: "ini",
  js: "javascript",
  json: "json",
  jsx: "javascript",
  log: "plaintext",
  md: "markdown",
  mjs: "javascript",
  php: "php",
  plist: "xml",
  py: "python",
  rb: "ruby",
  rs: "rust",
  sh: "bash",
  sql: "sql",
  toml: "ini",
  ts: "typescript",
  tsx: "typescript",
  txt: "plaintext",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
  zsh: "bash",
}

function isTextEntry(entry: ArchiveEntry, blob: Blob): boolean {
  const mimeType = blob.type.toLowerCase()
  if (mimeType.startsWith("text/")) return true
  if (mimeType.includes("json") || mimeType.includes("xml")) return true
  if (mimeType.includes("yaml") || mimeType.includes("toml")) return true
  return TEXT_EXTENSIONS.has(entry.extension.toLowerCase())
}

function isImageEntry(entry: ArchiveEntry, blob: Blob): boolean {
  if (blob.type.toLowerCase().startsWith("image/")) return true
  return IMAGE_EXTENSIONS.has(entry.extension.toLowerCase())
}

function isPdfEntry(entry: ArchiveEntry, blob: Blob): boolean {
  return (
    blob.type.toLowerCase() === PDF_MIME_TYPE ||
    entry.extension.toLowerCase() === "pdf"
  )
}

function resolveTextPreviewLanguage(entry: ArchiveEntry, blob: Blob): string {
  const fromExtension =
    PREVIEW_LANGUAGE_BY_EXTENSION[entry.extension.toLowerCase()]
  if (fromExtension) return fromExtension

  const mimeType = blob.type.toLowerCase()
  if (mimeType.includes("json")) return "json"
  if (mimeType.includes("xml") || mimeType.includes("html")) return "xml"
  if (mimeType.includes("yaml")) return "yaml"
  if (mimeType.includes("javascript")) return "javascript"
  if (mimeType.includes("typescript")) return "typescript"
  if (mimeType.includes("css")) return "css"
  return "plaintext"
}

export {
  MAX_TEXT_PREVIEW_BYTES,
  isImageEntry,
  isPdfEntry,
  isTextEntry,
  resolveTextPreviewLanguage,
}
