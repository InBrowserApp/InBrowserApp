const known = [
  "protected",
  "incomplete",
  "empty",
  "noBook",
  "ambiguous",
  "encoding",
  "unsupported",
] as const
export function failure(reason: unknown) {
  if (reason instanceof RangeError) return "resourceLimit"
  if (reason instanceof Error) {
    const key = known.find((key) => key === reason.message)
    if (key) return key
  }
  return "invalid"
}
