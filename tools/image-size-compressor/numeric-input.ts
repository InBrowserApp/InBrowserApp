function normalizeDigits(input: string) {
  return input
    .trim()
    .normalize("NFKC")
    .replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (digit) =>
      String(digit.charCodeAt(0) & 15)
    )
}

export function limitInBytes(input: string) {
  const value = normalizeDigits(input)
    .replace(/^(?:<=|≤)\s*/, "")
    .replace(/\s*kb$/i, "")
  if (!/^\d+([.,\u066b]\d{1,3})?$/.test(value)) return 0
  const [whole, fraction = ""] = value.split(/[.,\u066b]/)
  return Number(whole) * 1000 + Number(fraction.padEnd(3, "0"))
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
