const previewEncodings = new Set(["", "identity", "gzip", "x-gzip", "deflate"])
const supportedImages = /^image\/(png|jpeg|gif|webp|avif|bmp)$/
type HeaderEntries = [string, string][]

export type Capture = {
  url: string
  date: string
  type: string
  status?: string | number
  headers: HeaderEntries
  httpHeaders: HeaderEntries
  contentType: string
  body?: Uint8Array
}

export function mediaType(contentType: string) {
  return contentType.split(";", 1)[0]!.trim().toLowerCase()
}

export function isHtml(contentType: string) {
  return ["text/html", "application/xhtml+xml"].includes(mediaType(contentType))
}

export function isImage(contentType: string) {
  return supportedImages.test(mediaType(contentType))
}

export function hasHtmlBody(
  capture: Capture
): capture is Capture & { body: Uint8Array } {
  return Boolean(capture.body?.length) && isHtml(capture.contentType)
}

export async function openWarc(file: File, signal: AbortSignal) {
  const { WARCParser } = await import("warcio")
  signal.throwIfAborted()
  const records: Capture[] = []
  const reader = file.stream().getReader()
  const cancel = () => reader.cancel().catch(() => {})
  signal.addEventListener("abort", cancel, { once: true })
  try {
    for await (const record of new WARCParser(reader)) {
      signal.throwIfAborted()
      if (
        !/^WARC\/1\.[01]$/.test(record.warcHeaders.statusline) ||
        !record.warcType ||
        !/^\d+$/.test(record.warcHeader("Content-Length") ?? "")
      ) {
        throw new Error("Invalid WARC header")
      }
      const type = record.warcType
      const http = record.httpHeaders
      const contentType =
        http?.headers.get("content-type") ??
        (type === "resource" ? record.warcContentType : null) ??
        ""
      const media = mediaType(contentType)
      const encoding =
        http?.headers.get("content-encoding")?.toLowerCase() ?? ""
      const body =
        (type === "response" || type === "resource") &&
        previewEncodings.has(encoding) &&
        (isHtml(media) || media === "text/css" || isImage(media))
          ? await record.readFully(true)
          : undefined
      records.push({
        url: record.warcTargetURI ?? "",
        date: record.warcDate ?? "",
        type,
        status:
          type === "response" || type === "revisit"
            ? http?.statusCode
            : undefined,
        headers: Array.from(record.warcHeaders.headers.entries()),
        httpHeaders: http ? Array.from(http.headers.entries()) : [],
        contentType,
        body,
      })
    }
    signal.throwIfAborted()
    if (!records.length) throw new Error("Empty WARC")
    return records
  } finally {
    signal.removeEventListener("abort", cancel)
    await cancel()
    reader.releaseLock()
  }
}

export function sampleArchive() {
  const css =
    "body{background:#f4f7f9;color:#182635;font:16px/1.6 system-ui} main{max-width:42rem;margin:2rem auto} h1{line-height:1.1} small{color:#385872}"
  const html =
    '<!doctype html><html lang="en"><head><title>Field notes</title><link rel="stylesheet" href="/notes.css"></head><body><main><small>EXAMPLE WEB ARCHIVE</small><h1>Field notes from the coast</h1><p>A quiet morning, a rising tide, and a path along the cliffs. This is a sample web page saved in a WARC file.</p></main></body></html>'
  const page = (url: string, contentType: string, data: string, id: number) => {
    const payload = `HTTP/1.1 200 OK\r\nContent-Type: ${contentType}\r\n\r\n${data}`
    return [
      "WARC/1.1",
      "WARC-Type: response",
      `WARC-Record-ID: <urn:uuid:00000000-0000-4000-8000-00000000000${id}>`,
      `WARC-Target-URI: https://example.org${url}`,
      "WARC-Date: 2024-06-01T10:30:00Z",
      "Content-Type: application/http; msgtype=response",
      `Content-Length: ${new TextEncoder().encode(payload).length}`,
      "",
      payload,
      "",
      "",
    ].join("\r\n")
  }
  return new File(
    [
      page("/field-notes", "text/html; charset=utf-8", html, 1),
      page("/notes.css", "text/css", css, 2),
    ],
    "field-notes.warc"
  )
}
