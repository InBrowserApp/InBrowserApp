/**
 * Resolve the user's most-preferred supported language from the ordered
 * list of browser language tags (`navigator.languages`).
 *
 * `navigator.languages` is already a priority-ordered list of what the
 * user wants, so we walk it in order and return the first tag that maps
 * to a supported language. Per tag, matching precedence is:
 *
 *   1. Exact match (case-insensitive):           "zh-TW"      -> "zh-TW"
 *   2. Region-stripped base equals a code:        "en-GB"      -> "en"
 *   3. Base shares with a supported variant:       "zh"         -> "zh-CN"
 *
 * Tier 3 disambiguates Chinese script/region subtags so that Traditional
 * preferences ("zh-Hant", "zh-HK") never resolve to a Simplified code and
 * vice versa. Returns `null` when no browser tag maps to a supported code.
 */
function normalize(tag: string): string {
  return tag.trim().toLowerCase()
}

function baseOf(tag: string): string {
  return normalize(tag).split("-")[0] ?? ""
}

function disambiguateVariant(
  tag: string,
  variants: readonly string[],
  fallback: string
): string {
  const lower = normalize(tag)
  const wantsTraditional =
    lower.includes("hant") || /(^|-)(tw|hk|mo)(-|$)/.test(lower)
  const wantsSimplified =
    lower.includes("hans") || /(^|-)(cn|sg)(-|$)/.test(lower)

  if (wantsTraditional) {
    const traditional = variants.find((code) => /-(tw|hk|mo)$/i.test(code))
    if (traditional) return traditional
  }
  if (wantsSimplified) {
    const simplified = variants.find((code) => /-(cn|sg)$/i.test(code))
    if (simplified) return simplified
  }

  return fallback
}

function bestSupportedMatch(
  tag: string,
  supported: readonly string[]
): string | null {
  const lower = normalize(tag)
  if (lower === "") {
    return null
  }

  // 1. exact (case-insensitive)
  const exact = supported.find((code) => normalize(code) === lower)
  if (exact) {
    return exact
  }

  // 2. region-stripped base equals a supported code exactly
  const base = baseOf(tag)
  const baseExact = supported.find((code) => normalize(code) === base)
  if (baseExact) {
    return baseExact
  }

  // 3. base shares with one or more supported regional variants
  const variants = supported.filter((code) => baseOf(code) === base)
  const [firstVariant] = variants
  if (!firstVariant) {
    return null
  }

  return variants.length === 1
    ? firstVariant
    : disambiguateVariant(tag, variants, firstVariant)
}

function resolvePreferredLanguageCode(
  supported: readonly string[],
  browserLanguages: readonly string[]
): string | null {
  for (const tag of browserLanguages) {
    const match = bestSupportedMatch(tag, supported)
    if (match) {
      return match
    }
  }

  return null
}

export { resolvePreferredLanguageCode }
