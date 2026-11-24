type NoteCode =
  | "quote"
  | "parentheses"
  | "owner"
  | "record"
  | "invalidTtl"
  | "invalidOrigin"
  | "unsupported"

type Note = { line: number; code: NoteCode; directive?: string }
type Statement = { line: number; tokens: string[]; inheritOwner: boolean }
type ZoneRecord = {
  line: number
  name: string
  type: string
  ttl: number | null
  class: string
  data: string
}

const CLASS = /^(?:IN|CH|HS|CLASS\d+)$/i
const TYPE = /^[A-Z][A-Z0-9-]*$/i
const TTL_SYNTAX = /^(?:\d+[wdhms])+\d*$/i
const SECONDS: Readonly<Record<string, number>> = {
  w: 604800,
  d: 86400,
  h: 3600,
  m: 60,
  s: 1,
}

function scanZone(source: string) {
  const statements: Statement[] = []
  const notes: Note[] = []
  let tokens: string[] = []
  let start = 1
  let inheritOwner = false
  let open = false

  for (const [index, text] of source
    .replace(/^\uFEFF/, "")
    .split(/\r\n?|\n/)
    .entries()) {
    if (!open) {
      start = index + 1
      inheritOwner = /^\s/.test(text)
    }

    // Keep quoted strings and escaped characters verbatim before recognizing comments and groups.
    const parts =
      text.match(/(?:\\.|"(?:\\.|[^"\\])*"|[^\s();"\\])+|;.*|[()"]|\\/g) ?? []
    let issue: NoteCode | undefined
    for (const part of parts) {
      if (part.startsWith(";")) break
      if (part === '"' || part === "\\") {
        issue = "quote"
        break
      }
      if (part === "(" || part === ")") {
        if (open === (part === "(")) {
          issue = "parentheses"
          break
        }
        open = part === "("
      } else {
        tokens.push(part)
      }
    }

    if (issue) {
      notes.push({ line: start, code: issue })
      tokens = []
      open = false
    } else if (!open && tokens.length > 0) {
      statements.push({ line: start, tokens, inheritOwner })
      tokens = []
    }
  }
  if (open) notes.push({ line: start, code: "parentheses" })
  return { statements, notes }
}

function ttlSeconds(token: string) {
  if (!/^\d+$/.test(token) && !TTL_SYNTAX.test(token)) return null

  const seconds = Array.from(
    token.toLowerCase().matchAll(/(\d+)([wdhms]?)/g)
  ).reduce(
    (sum, [, amount, unit]) => sum + Number(amount) * (SECONDS[unit!] ?? 1),
    0
  )
  return seconds <= 2147483647 ? seconds : null
}

function absoluteName(name: string, origin: string) {
  if (name === "@") return origin || name
  if (/(?:^|[^\\])(?:\\\\)*\.$/.test(name) || !origin) return name
  return origin === "." ? `${name}.` : `${name}.${origin}`
}

function readZone(source: string, initialOrigin = "") {
  const { statements, notes } = scanZone(source)
  const records: ZoneRecord[] = []
  const initial = initialOrigin.trim()
  let origin = initial ? absoluteName(initial, ".") : ""
  let owner = ""
  let defaultTtl: number | null = null
  let previousTtl: number | null = null
  let previousClass = "IN"

  for (const { tokens, line, inheritOwner } of statements) {
    const first = tokens[0]!
    if (first.startsWith("$")) {
      const directive = first.toUpperCase()
      const value = tokens[1]
      if (directive === "$ORIGIN") {
        if (!value || tokens.length !== 2 || value.startsWith('"')) {
          notes.push({ line, code: "invalidOrigin" })
        } else {
          origin = absoluteName(value, origin || ".")
        }
      } else if (directive === "$TTL") {
        const ttl = tokens.length === 2 ? ttlSeconds(value!) : null
        if (ttl === null) notes.push({ line, code: "invalidTtl" })
        else defaultTtl = ttl
      } else {
        notes.push({ line, code: "unsupported", directive })
      }
      continue
    }

    const name = inheritOwner ? owner : absoluteName(first, origin)
    if (!name) {
      notes.push({ line, code: "owner" })
      continue
    }

    let typeIndex = inheritOwner ? 0 : 1
    let ttl: number | null = null
    let recordClass: string | undefined
    let ttlInvalid = false
    for (const token of tokens.slice(typeIndex, typeIndex + 2)) {
      if (recordClass === undefined && CLASS.test(token)) {
        recordClass = token.toUpperCase()
      } else if (ttl === null && /^\d/.test(token)) {
        ttl = ttlSeconds(token)
        ttlInvalid = ttl === null
        if (ttlInvalid) break
      } else {
        break
      }
      typeIndex++
    }

    const type = tokens[typeIndex]?.toUpperCase() ?? ""
    const data = tokens.slice(typeIndex + 1).join(" ")
    if (ttlInvalid) {
      notes.push({ line, code: "invalidTtl" })
    } else if (!TYPE.test(type) || CLASS.test(type) || !data) {
      notes.push({ line, code: "record" })
    } else {
      owner = name
      previousClass = recordClass ?? previousClass
      if (ttl !== null) previousTtl = ttl
      records.push({
        line,
        name,
        type,
        ttl: ttl ?? defaultTtl ?? previousTtl,
        class: previousClass,
        data,
      })
    }
  }

  notes.sort((a, b) => a.line - b.line)
  return { records, notes }
}

export { readZone, type ZoneRecord, type Note }
