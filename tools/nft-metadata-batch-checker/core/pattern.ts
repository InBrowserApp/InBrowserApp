import { parseNftUrl } from "./urls"

export type IdFormat = "decimal" | "hex"
const maxId = (1n << 256n) - 1n
const maxRange = 500n

export function expandUriPattern(
  input: string,
  start: string,
  end: string,
  format: IdFormat
): { urls: string[] } | { error: "invalidPattern" | "invalidRange" } {
  const template = input.trim()
  const example = parseNftUrl(template.replaceAll("{id}", "1"))
  if (!template.includes("{id}") || !example || example.protocol === "data:") {
    return { error: "invalidPattern" }
  }

  const firstText = start.trim()
  const lastText = end.trim()
  if (!/^\d{1,78}$/.test(firstText) || !/^\d{1,78}$/.test(lastText)) {
    return { error: "invalidRange" }
  }

  const first = BigInt(firstText)
  const last = BigInt(lastText)
  if (last > maxId || last < first || last - first >= maxRange) {
    return { error: "invalidRange" }
  }

  const urls: string[] = []
  for (let id = first; id <= last; id++) {
    const token =
      format === "hex"
        ? id.toString(16).padStart(64, "0")
        : id.toString().padStart(firstText.length, "0")
    urls.push(template.replaceAll("{id}", token))
  }
  return { urls }
}
