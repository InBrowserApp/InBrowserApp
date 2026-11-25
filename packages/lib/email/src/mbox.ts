import { addressParser, decodeWords } from "postal-mime"
import { address, cleanLabel } from "./content"
import { parseMime } from "./mime"

export type MailSummary = {
  subject: string
  from: string
  to: string
  date: string
}

type Entry = MailSummary & { start: number; end: number }
type Header = keyof MailSummary

const envelope =
  /^From [^\s]+\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?\s+(?:(?:[+-]\d{4}|[A-Z]{1,5})\s+)?\d{4}(?:\s.*)?\s*$/
const field = /^([!-9;-~]+):\s*(.*)$/
const summaryFields = new Set(["subject", "from", "to", "date"])
const fromBytes = new TextEncoder().encode("From ")
const headerLimit = 64 * 1024
const decoder = new TextDecoder()

function decodeAddresses(value: string) {
  return cleanLabel(decodeWords(addressParser(value).map(address).join(", ")))
}

export async function indexMbox(file: Blob) {
  const entries: Entry[] = []
  let start = -1
  let headers: MailSummary = { subject: "", from: "", to: "", date: "" }
  let header: Header | undefined
  let hasHeaders = false
  function finish(end: number) {
    if (!hasHeaders) return
    entries.push({
      subject: cleanLabel(decodeWords(headers.subject)),
      from: decodeAddresses(headers.from),
      to: decodeAddresses(headers.to),
      date: cleanLabel(headers.date),
      start,
      end,
    })
  }
  let readingHeaders = false
  function readLine(bytes: Uint8Array, offset: number, length: number) {
    // Most body lines can be skipped without decoding.
    const separator = bytes[0] === 70 && envelope.test(decoder.decode(bytes))
    if (separator) {
      finish(offset)
      start = offset + length
      headers = { subject: "", from: "", to: "", date: "" }
      header = undefined
      hasHeaders = false
      readingHeaders = true
      return
    }
    if (!readingHeaders) return
    const line = decoder.decode(bytes).replace(/\r$/, "")
    if (!line || offset + length - start > headerLimit) {
      readingHeaders = false
      return
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
      if (summaryFields.has(name)) {
        header = name as Header
        headers[header] = match[2]!
      }
    }
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
        if (newline !== -1 && !length) {
          readLine(bytes, offset, bytes.length + 1)
          offset += bytes.length + 1
        } else {
          if (length < prefix.length)
            prefix.set(bytes.subarray(0, prefix.length - length), length)
          length += bytes.length
          if (newline !== -1) {
            readLine(prefix.subarray(0, length), offset, length + 1)
            offset += length + 1
            length = 0
          }
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
