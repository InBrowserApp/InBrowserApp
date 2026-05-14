const MIME_BY_EXTENSION: Record<string, string> = {
  avif: "image/avif",
  bash: "text/x-shellscript",
  bmp: "image/bmp",
  conf: "text/plain",
  css: "text/css",
  csv: "text/csv",
  gif: "image/gif",
  go: "text/x-go",
  html: "text/html",
  ini: "text/plain",
  java: "text/x-java-source",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  jsx: "text/javascript",
  log: "text/plain",
  md: "text/markdown",
  mjs: "text/javascript",
  php: "text/x-php",
  plist: "application/xml",
  png: "image/png",
  py: "text/x-python",
  rb: "text/x-ruby",
  rs: "text/x-rust",
  sh: "text/x-shellscript",
  sql: "application/sql",
  svg: "image/svg+xml",
  tif: "image/tiff",
  tiff: "image/tiff",
  toml: "application/toml",
  ts: "text/typescript",
  tsx: "text/typescript",
  txt: "text/plain",
  webp: "image/webp",
  xml: "application/xml",
  yaml: "application/yaml",
  yml: "application/yaml",
  zsh: "text/x-shellscript",
}

function guessMimeType(path: string): string {
  const extension = path.split(".").pop()!.toLowerCase()
  return MIME_BY_EXTENSION[extension] ?? "application/octet-stream"
}

function withGuessedMimeType(blob: Blob, path: string): Blob {
  if (blob.type && blob.type.toLowerCase() !== "application/octet-stream") {
    return blob
  }

  return new Blob([blob], { type: guessMimeType(path) })
}

export { guessMimeType, withGuessedMimeType }
