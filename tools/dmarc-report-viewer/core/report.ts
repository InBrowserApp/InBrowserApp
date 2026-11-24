type Alignment = "pass" | "fail" | "unknown"
type Outcome = "passed" | "failed" | "unknown"
type ErrorCode = "invalidXml" | "invalidReport" | "invalidRecord"

type RawAuth = {
  kind: "dkim" | "spf"
  domain: string
  result: string
  selector: string
  scope: string
}

type SourceRecord = {
  index: number
  ip: string
  count: bigint
  from: string
  disposition: string
  dkim: Alignment
  spf: Alignment
  reasons: string[]
  auth: RawAuth[]
}

type Report = {
  domain: string
  reporter: string
  id: string
  period: { begin: number; end: number } | null
  policy: { name: string; value: string }[]
  records: SourceRecord[]
  totals: Record<Outcome | "total", bigint>
}

type ReportResult =
  | { status: "ready"; report: Report }
  | { status: "error"; error: ErrorCode }

const XML_PARSE_ERROR = "http://www.mozilla.org/newlayout/xml/parsererror.xml"
const LEGACY_NAMESPACE = "http://dmarc.org/dmarc-xml/0.1"
const POLICY_FIELDS = [
  "p",
  "sp",
  "np",
  "adkim",
  "aspf",
  "pct",
  "testing",
  "discovery_method",
  "fo",
]

function elements(parent: Element | undefined) {
  return parent
    ? Array.from(parent.children).filter(
        (element) =>
          element.namespaceURI === parent.namespaceURI ||
          (parent.namespaceURI === LEGACY_NAMESPACE &&
            element.namespaceURI === null)
      )
    : []
}

function child(parent: Element | undefined, name: string) {
  return elements(parent).find((element) => element.localName === name)
}

function value(parent: Element | undefined, name: string) {
  return child(parent, name)?.textContent!.trim() ?? ""
}

function timestamp(text: string) {
  if (!/^[+-]?\d+$/.test(text)) return null
  const milliseconds = Number(text) * 1000
  return Math.abs(milliseconds) <= 8.64e15 ? milliseconds : null
}

function alignment(text: string): Alignment {
  const result = text.toLowerCase()
  return result === "pass" || result === "fail" ? result : "unknown"
}

function readRecord(record: Element, index: number): SourceRecord | null {
  const row = child(record, "row")
  const ip = value(row, "source_ip")
  const countText = value(row, "count")
  if (!ip || !/^[+-]?\d+$/.test(countText)) return null
  const count = BigInt(countText)
  if (count < 0n) return null

  const evaluated = child(row, "policy_evaluated")
  const reasons = elements(evaluated)
    .filter((element) => element.localName === "reason")
    .map((element) =>
      [value(element, "type"), value(element, "comment")]
        .filter(Boolean)
        .join(" · ")
    )
    .filter(Boolean)
  const auth = elements(child(record, "auth_results")).flatMap<RawAuth>(
    (element) => {
      const kind = element.localName
      if (kind !== "spf" && kind !== "dkim") return []
      return [
        {
          kind,
          domain: value(element, "domain"),
          result: value(element, "result"),
          selector: value(element, "selector"),
          scope: value(element, "scope"),
        },
      ]
    }
  )

  return {
    index,
    ip,
    count,
    from: value(child(record, "identifiers"), "header_from"),
    disposition: value(evaluated, "disposition"),
    dkim: alignment(value(evaluated, "dkim")),
    spf: alignment(value(evaluated, "spf")),
    reasons,
    auth,
  }
}

function outcome(record: SourceRecord): Outcome {
  if (record.dkim === "pass" || record.spf === "pass") return "passed"
  if (record.dkim === "fail" && record.spf === "fail") return "failed"
  return "unknown"
}

function readReport(source: string): ReportResult {
  const document = new DOMParser().parseFromString(source, "application/xml")
  if (
    document.getElementsByTagNameNS(XML_PARSE_ERROR, "parsererror").length > 0
  ) {
    return { status: "error", error: "invalidXml" }
  }

  const root = document.documentElement
  const metadata = child(root, "report_metadata")
  const published = child(root, "policy_published")
  const domain = value(published, "domain")
  if (root.localName !== "feedback" || !metadata || !domain) {
    return { status: "error", error: "invalidReport" }
  }

  const dates = child(metadata, "date_range")
  const begin = timestamp(value(dates, "begin"))
  const end = timestamp(value(dates, "end"))
  const period =
    begin !== null && end !== null && begin <= end ? { begin, end } : null
  const policy = POLICY_FIELDS.map((name) => ({
    name,
    value: value(published, name),
  })).filter((field) => field.value !== "")
  const records: SourceRecord[] = []
  const totals = { total: 0n, passed: 0n, failed: 0n, unknown: 0n }
  for (const element of elements(root)) {
    if (element.localName !== "record") continue
    const record = readRecord(element, records.length)
    if (!record) return { status: "error", error: "invalidRecord" }
    records.push(record)
    totals.total += record.count
    totals[outcome(record)] += record.count
  }
  records.sort((first, second) =>
    first.count === second.count ? 0 : first.count > second.count ? -1 : 1
  )

  return {
    status: "ready",
    report: {
      domain,
      reporter: value(metadata, "org_name"),
      id: value(metadata, "report_id"),
      period,
      policy,
      records,
      totals,
    },
  }
}

export { readReport, type Report, type ReportResult, type SourceRecord }
