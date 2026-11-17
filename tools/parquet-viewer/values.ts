import type { Format, Row, Value } from "./types"

export function normalize(value: unknown): Value {
  if (value == null) return null
  if (typeof value === "bigint") return String(value)
  if (typeof value === "number")
    return Number.isFinite(value) ? value : String(value)
  if (typeof value === "string" || typeof value === "boolean") return value
  if (value instanceof Date) return value.toISOString()
  if (value instanceof Uint8Array)
    return `0x${Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("")}`
  if (Array.isArray(value)) return value.map(normalize)
  if (value instanceof Map)
    return Array.from(value, ([key, item]) => [normalize(key), normalize(item)])
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, normalize(item)])
  )
}

export function cellText(value: Value | undefined): string {
  if (value == null) return ""
  return typeof value === "object" ? JSON.stringify(value) : String(value)
}

function csv(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}

export function exportPart(rows: Row[], columns: string[], format: Format) {
  if (format === "json")
    return rows.map((row) => JSON.stringify(row)).join(",\n")
  return rows
    .map((row) => columns.map((column) => csv(cellText(row[column]))).join(","))
    .join("\r\n")
}

export function csvHeader(columns: string[]) {
  return columns.map(csv).join(",") + "\r\n"
}
