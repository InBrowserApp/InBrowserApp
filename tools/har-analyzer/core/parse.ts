import type { Body, Capture, Entry, Pair, Phase } from "../types"

export const MAX_FILE_SIZE = 20 * 1024 * 1024
export const MAX_ENTRIES = 20_000
export const PHASES = [
  "blocked",
  "dns",
  "connect",
  "send",
  "wait",
  "receive",
] as const

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function text(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function positive(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null
}

function pairs(value: unknown): Pair[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const pair = record(item)
    return typeof pair.name === "string" && typeof pair.value === "string"
      ? [{ name: pair.name, value: pair.value }]
      : []
  })
}

function body(value: unknown): Body {
  const data = record(value)
  return {
    text: typeof data.text === "string" ? data.text : null,
    mimeType: text(data.mimeType),
    encoding: text(data.encoding),
    params: pairs(data.params),
  }
}

function query(value: unknown, url: string): Pair[] {
  if (Array.isArray(value)) return pairs(value)
  try {
    return Array.from(new URL(url).searchParams, ([name, value]) => ({
      name,
      value,
    }))
  } catch {
    return []
  }
}

function entry(value: unknown, id: number): Entry | null {
  const data = record(value)
  const request = record(data.request)
  const response = record(data.response)
  const started = Date.parse(text(data.startedDateTime))
  const status = positive(response.status)
  const url = text(request.url)
  const method = text(request.method)
  if (
    !Number.isFinite(started) ||
    !url ||
    !method ||
    status === null ||
    !Number.isInteger(status) ||
    status > 599
  )
    return null

  const rawTimings = record(data.timings)
  const timings = Object.fromEntries(
    [...PHASES, "ssl"].map((phase) => [phase, positive(rawTimings[phase])])
  ) as Record<Phase, number | null>
  const duration = positive(data.time)
  const content = record(response.content)
  const headersSize = positive(response.headersSize)
  const bodySize = positive(response.bodySize)
  const transferSize =
    positive(response._transferSize) ??
    (headersSize !== null && bodySize !== null ? headersSize + bodySize : null)
  return {
    id,
    started,
    duration,
    url,
    method,
    status,
    statusText: text(response.statusText),
    protocol: text(response.httpVersion),
    mimeType: text(content.mimeType),
    transferSize,
    contentSize: positive(content.size),
    timings,
    request: {
      headers: pairs(request.headers),
      cookies: pairs(request.cookies),
      query: query(request.queryString, url),
      body: body(request.postData),
    },
    response: {
      headers: pairs(response.headers),
      cookies: pairs(response.cookies),
      body: body(content),
    },
  }
}

export function parseHar(input: string): Capture {
  let data: unknown
  try {
    data = JSON.parse(input.replace(/^\uFEFF/, ""))
  } catch {
    throw new Error("invalidJson")
  }
  const raw = record(record(data).log).entries
  if (!Array.isArray(raw)) throw new Error("invalidHar")
  if (raw.length > MAX_ENTRIES) throw new Error("tooMany")
  const entries: Entry[] = []
  let started = Infinity
  let finished = -Infinity
  raw.forEach((value, id) => {
    const item = entry(value, id)
    if (!item) return
    entries.push(item)
    started = Math.min(started, item.started)
    finished = Math.max(finished, item.started + (item.duration ?? 0))
  })
  if (raw.length > 0 && entries.length === 0) throw new Error("noValid")
  return {
    entries,
    skipped: raw.length - entries.length,
    started: entries.length > 0 ? started : 0,
    span: entries.length > 0 ? finished - started : 0,
  }
}
