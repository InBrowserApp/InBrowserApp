/** Keep a valid source language; never guess from the interface locale. */
export function languageTag(value: unknown): string | undefined {
  const first = Array.isArray(value) ? value[0] : value
  if (typeof first !== "string" || !first.trim()) return undefined
  try {
    return Intl.getCanonicalLocales(first.trim().replaceAll("_", "-"))[0]
  } catch {
    return undefined
  }
}
