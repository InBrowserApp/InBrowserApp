/**
 * Resolve the visitor's most-preferred supported language from the
 * ordered list of browser language tags (`navigator.languages`).
 *
 * Follows the RFC 4647 "Lookup" scheme: the browser list is already in
 * priority order, so we walk it and return the first tag that resolves to
 * a supported language, progressively relaxing the match for that tag:
 *
 *   1. Exact tag (case-insensitive):            "zh-TW"       -> "zh-TW"
 *   2. Base language equals a supported code:    "en-US"       -> "en"
 *   3. Base maps to a supported regional variant
 *      with script/region disambiguation:        "zh-Hant-HK"  -> "zh-TW"
 *
 * Two extra real-world rules from Unicode CLDR / BCP-47 practice:
 *   - Deprecated / macrolanguage aliases are normalised before matching
 *     (e.g. browsers report Norwegian as "nb"/"nn", not "no").
 *   - Chinese falls back by *script*, not region: Traditional locales
 *     (Hant, TW, HK, MO) never collapse into a Simplified variant, and
 *     vice versa (Hans, CN, SG, MY). A bare "zh" defaults to Simplified.
 *
 * Returns `null` when no browser tag maps to a supported code.
 */

// Deprecated / macrolanguage base codes → the base we actually serve.
const LANGUAGE_ALIASES: Readonly<Record<string, string>> = {
  nb: "no", // Norwegian Bokmål  → Norwegian
  nn: "no", // Norwegian Nynorsk → Norwegian
  iw: "he", // legacy code for Hebrew
  in: "id", // legacy code for Indonesian
}

// Script/region subtags that select a specific Chinese script when only
// regional variants (e.g. zh-CN / zh-TW) are offered.
const TRADITIONAL_SUBTAG = /(^|-)(hant|tw|hk|mo)(-|$)/
const SIMPLIFIED_SUBTAG = /(^|-)(hans|cn|sg|my)(-|$)/
const TRADITIONAL_VARIANT = /-(tw|hk|mo)$/i
const SIMPLIFIED_VARIANT = /-(cn|sg|my)$/i

function normalize(tag: string): string {
  return tag.trim().toLowerCase()
}

function baseOf(tag: string): string {
  return normalize(tag).split("-")[0] ?? ""
}

/**
 * Choose among supported variants that share a base language (only
 * Chinese in practice). Traditional vs Simplified is decided by script
 * first, then region; an undetermined tag (bare "zh") defaults to the
 * Simplified variant.
 */
function pickRegionalVariant(
  lower: string,
  variants: readonly string[],
  fallback: string
): string {
  if (TRADITIONAL_SUBTAG.test(lower)) {
    const traditional = variants.find((code) => TRADITIONAL_VARIANT.test(code))
    if (traditional) return traditional
  }
  if (SIMPLIFIED_SUBTAG.test(lower)) {
    const simplified = variants.find((code) => SIMPLIFIED_VARIANT.test(code))
    if (simplified) return simplified
  }

  return variants.find((code) => SIMPLIFIED_VARIANT.test(code)) ?? fallback
}

function bestSupportedMatch(
  tag: string,
  supported: readonly string[]
): string | null {
  const lower = normalize(tag)
  if (lower === "") {
    return null
  }

  // 1. exact tag (case-insensitive)
  const exact = supported.find((code) => normalize(code) === lower)
  if (exact) {
    return exact
  }

  // 2. base language (after alias normalisation) equals a supported code
  const rawBase = baseOf(tag)
  const base = LANGUAGE_ALIASES[rawBase] ?? rawBase
  const baseExact = supported.find((code) => normalize(code) === base)
  if (baseExact) {
    return baseExact
  }

  // 3. base maps to one or more supported regional variants
  const variants = supported.filter((code) => baseOf(code) === base)
  const [firstVariant] = variants
  if (!firstVariant) {
    return null
  }

  return variants.length === 1
    ? firstVariant
    : pickRegionalVariant(lower, variants, firstVariant)
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
