function normalizeDigits(input: string) {
  return input
    .trim()
    .normalize("NFKC")
    .replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (digit) =>
      String(digit.charCodeAt(0) & 15)
    )
}

function integerDigits(
  value: string,
  group: string,
  right: number,
  middle: number
) {
  const groups = value.split(group)
  if (!groups.every((part) => /^\d+$/.test(part))) return ""
  if (groups.length === 1) return value

  const first = groups[0] ?? ""
  const last = groups.at(-1) ?? ""
  return /^[1-9]/.test(first) &&
    first.length <= middle &&
    last.length === right &&
    groups.slice(1, -1).every((part) => part.length === middle)
    ? groups.join("")
    : ""
}

export function limitInBytes(input: string, lang: string) {
  const normalized = normalizeDigits(input).replace(/^(?:<=|≤)\s*/, "")
  const places = /mb$/i.test(normalized) ? 6 : 3
  const parts = new Intl.NumberFormat(lang).formatToParts(123456789123.5)
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? "."
  const group =
    parts.find((part) => part.type === "group")?.value.normalize("NFKC") ?? ","
  const value = normalized
    .replace(/\s*(?:kb|mb)$/i, "")
    .replaceAll("\u066b", decimal)
    .replaceAll("\u066c", group)
  const lengths = parts
    .filter((part) => part.type === "integer")
    .map((part) => part.value.length)
  const [whole = "", fraction = "", ...extra] = value.split(decimal)
  if (extra.length) return 0

  let integer = integerDigits(
    whole,
    group,
    lengths.at(-1) ?? 3,
    lengths.at(-2) ?? 3
  )
  let digits = fraction
  if (!integer && !value.includes(decimal)) {
    // Accept a pasted decimal separator from another locale when this
    // number is not a valid grouping in the tool's locale.
    const alternate = /^(\d+)[.,](\d+)$/.exec(value)
    integer = alternate?.[1] ?? ""
    digits = alternate?.[2] ?? ""
  }
  if (
    !integer ||
    (value.includes(decimal) && !digits) ||
    !/^\d*$/.test(digits) ||
    digits.length > places
  )
    return 0

  const bytes = Number(integer + digits.padEnd(places, "0"))
  return Number.isSafeInteger(bytes) ? bytes : 0
}

export function pixels(input: string) {
  const value = normalizeDigits(input).replace(/\s*px$/i, "")
  const number = /^\d+$/.test(value) ? Number(value) : 0
  return Number.isSafeInteger(number) && number > 0 ? number : 0
}

export function pastedDimensions(input: string) {
  const pair = /^(\d+)\s*(?:px\s*)?[x×]\s*(\d+)\s*(?:px)?$/i.exec(
    normalizeDigits(input)
  )
  if (!pair) return null
  const width = pixels(pair[1] ?? "")
  const height = pixels(pair[2] ?? "")
  return width > 0 && height > 0 ? { width, height } : null
}
