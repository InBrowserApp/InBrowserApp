import { addressParser, decodeWords } from "postal-mime"
import { address, cleanLabel } from "./content"
import { parseMime } from "./mime"
import type { MailSummary } from "./archive"

type Entry = MailSummary & { start: number; end: number; byteCounted: boolean }
type Header = keyof Omit<MailSummary, "folder">

const envelope =
  /^From [^\s]+\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?\s+(?:(?:[+-]\d{4}|[A-Z]{1,5})\s+)?\d{4}(?:\s.*)?\s*$/
const field = /^([!-9;-~]+):\s*(.*)$/
const fromBytes = new TextEncoder().encode("From ")
const headerLimit = 64 * 1024
const utf8 = new TextDecoder("utf-8", { fatal: true })
const latin1 = new TextDecoder("latin1")

function decodeHeader(bytes: Uint8Array) {
  try {
    return utf8.decode(bytes)
  } catch {
    return latin1.decode(bytes)
  }
}

async function isBodyEnd(file: Blob, end: number) {
  if (!Number.isSafeInteger(end) || end > file.size) return false
  if (end === file.size) return true
  const probe = await file.slice(end - 1, end + 512).arrayBuffer()
  const suffix = latin1.decode(probe)
  const rest = suffix.slice(1)
  if (suffix[0] !== "\n" && !/^\r?\n/.test(rest)) return false
  const next = rest.replace(/^(?:\r?\n)+/, "")
  return next
    ? envelope.test(next.split(/\r?\n/, 1)[0]!)
    : end + rest.length === file.size
}

function decodeAddresses(value: string) {
  return cleanLabel(addressParser(value).map(address).join(", "))
}

export async function indexMbox(file: Blob) {
  const entries: Entry[] = []
  let start = -1
  let headers: MailSummary = { subject: "", from: "", to: "", date: "" }
  let header: Header | undefined
  let hasHeaders = false
  let contentLength: number | undefined
  let bodyEnd = 0
  function finish(end: number) {
    if (!hasHeaders) return
    entries.push({
      subject: cleanLabel(decodeWords(headers.subject)),
      from: decodeAddresses(headers.from),
      to: decodeAddresses(headers.to),
      date: cleanLabel(headers.date),
      start,
      end: bodyEnd || end,
      byteCounted: bodyEnd > 0,
    })
  }
  let readingHeaders = false
  function readLine(bytes: Uint8Array, offset: number, length: number) {
    // Most body lines can be skipped without decoding.
    if (offset < bodyEnd) return
    const separator =
      bytes[0] === 70 && envelope.test(latin1.decode(bytes.subarray(0, 512)))
    if (separator) {
      finish(offset)
      start = offset + length
      headers = { subject: "", from: "", to: "", date: "" }
      header = undefined
      hasHeaders = false
      contentLength = undefined
      bodyEnd = 0
      readingHeaders = true
      return
    }
    if (!readingHeaders) return
    if (offset + length - start > headerLimit) {
      readingHeaders = false
      return
    }
    const line = decodeHeader(bytes).replace(/\r$/, "")
    if (!line) {
      readingHeaders = false
      return contentLength === undefined
        ? undefined
        : offset + length + contentLength
    }
    if (header && /^[ \t]/.test(line)) {
      headers[header] += " " + line.trim()
      return
    }
    const match = field.exec(line)
    header = undefined
    if (match) {
      hasHeaders = true
      const name = match[1]!.toLowerCase()
      if (name === "content-length" && /^\d+$/.test(match[2]!.trim())) {
        contentLength = Number(match[2])
      } else if (Object.hasOwn(headers, name)) {
        header = name as Header
        headers[header] = match[2]!
      }
    }
    return undefined
  }

  // The line buffer is capped independently of the file or message size.
  const prefix = new Uint8Array(headerLimit)
  let length = 0
  let offset = 0
  const reader = file.stream().getReader()
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      let cursor = 0
      while (cursor < value.length) {
        const newline = value.indexOf(10, cursor)
        const end = newline === -1 ? value.length : newline
        const bytes = value.subarray(cursor, end)
        if (length || newline === -1) {
          if (length < prefix.length)
            prefix.set(bytes.subarray(0, prefix.length - length), length)
          length += bytes.length
        }
        if (newline !== -1) {
          const line = length ? prefix.subarray(0, length) : bytes
          const width = (length || bytes.length) + 1
          const expected = readLine(line, offset, width)
          if (expected !== undefined && (await isBodyEnd(file, expected)))
            bodyEnd = expected
          offset += width
          length = 0
        }
        cursor = end + 1
      }
    }
    if (length) readLine(prefix.subarray(0, length), offset, length)
    finish(file.size)
    if (!entries.length) throw new Error("invalid")
  } finally {
    reader.releaseLock()
  }
  return entries
}

export async function readMboxMessage(file: Blob, entry: Entry) {
  const raw = new Uint8Array(
    await file.slice(entry.start, entry.end).arrayBuffer()
  )
  if (entry.byteCounted)
    return parseMime(raw, "EML", { attachmentBytes: "all" })
  let preserved = 0
  let cursor = 0
  let body = false
  while (cursor < raw.length) {
    const newline = raw.indexOf(10, cursor)
    const end = newline === -1 ? raw.length : newline + 1
    let lineStart = cursor
    if (body && raw[cursor] === 62) {
      let first = cursor + 1
      while (raw[first] === 62) first++
      if (
        first + fromBytes.length <= end &&
        fromBytes.every((byte, i) => raw[first + i] === byte)
      )
        lineStart++
    }
    if (
      (end === cursor + 1 && raw[cursor] === 10) ||
      (end === cursor + 2 && raw[cursor] === 13 && raw[cursor + 1] === 10)
    )
      body = true
    if (lineStart !== preserved) raw.copyWithin(preserved, lineStart, end)
    preserved += end - lineStart
    cursor = end
  }
  return parseMime(raw.subarray(0, preserved), "EML", {
    attachmentBytes: "all",
  })
}
