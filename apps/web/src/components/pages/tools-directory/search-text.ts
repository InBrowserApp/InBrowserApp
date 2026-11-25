import type { SiteLanguage } from "@/lib/site"

const wordSegmenters = new Map<SiteLanguage, Intl.Segmenter>()
const graphemeSegmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : undefined

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, " ")
}

function normalizeSearchText(text: string, language: SiteLanguage) {
  return normalizeQuery(text.normalize("NFKC")).toLocaleLowerCase(language)
}

function foldSearchText(text: string) {
  return (
    text
      .normalize("NFD")
      // Keep marks in scripts where they are part of the spelling (e.g. Thai).
      .replace(
        /([\p{Script=Latin}\p{Script=Arabic}\p{Script=Hebrew}])\p{M}+/gu,
        "$1"
      )
      .normalize("NFC")
      .replace(/ı/g, "i")
      .replace(/đ/g, "d")
      .replace(/ß/g, "ss")
      .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
      .replace(/(^| )\p{M}+/gu, "$1")
      .trim()
  )
}

function prepareSearchText(text: string, language: SiteLanguage) {
  const normalized = normalizeSearchText(text, language)
  const folded = foldSearchText(normalized)

  return { normalized, folded, compact: folded.replaceAll(" ", "") }
}

type SearchText = ReturnType<typeof prepareSearchText>

function getSearchTerms(text: string, language: SiteLanguage) {
  if (!text) {
    return []
  }

  if (typeof Intl.Segmenter !== "function") {
    return text.split(" ")
  }

  let segmenter = wordSegmenters.get(language)
  if (!segmenter) {
    segmenter = new Intl.Segmenter(language, { granularity: "word" })
    wordSegmenters.set(language, segmenter)
  }

  const terms = [...segmenter.segment(text)]
    .filter(({ isWordLike }) => isWordLike)
    .map(({ segment }) => segment)

  return [...new Set(terms)]
}

function prepareSearchQuery(query: string, language: SiteLanguage) {
  const text = prepareSearchText(query, language)
  return { ...text, terms: getSearchTerms(text.folded, language) }
}

type SearchQuery = ReturnType<typeof prepareSearchQuery>

function splitSuggestionName(
  name: string,
  query: SearchQuery,
  language: SiteLanguage
) {
  const graphemes = graphemeSegmenter
    ? [...graphemeSegmenter.segment(name)]
    : [...name.matchAll(/\P{M}\p{M}*|\p{M}+/gu)].map((match) => ({
        segment: match[0],
        index: match.index,
      }))
  let compact = ""
  const positions: { start: number; end: number }[] = []

  // Normalization can expand one grapheme or omit it. Keep its original range
  // so the highlight always slices the displayed title.
  for (const { segment, index } of graphemes) {
    const part = prepareSearchText(segment, language).compact
    const range = { start: index, end: index + segment.length }

    compact += part
    for (let offset = 0; offset < part.length; offset++) {
      positions.push(range)
    }
  }

  for (const term of [query.compact, ...query.terms]) {
    const index = compact.indexOf(term)
    const start = positions[index]?.start
    const end = positions[index + term.length - 1]?.end

    if (start !== undefined && end !== undefined) {
      return {
        pre: name.slice(0, start),
        match: name.slice(start, end),
        post: name.slice(end),
      }
    }
  }

  return { match: "", post: "", pre: name }
}

export {
  normalizeQuery,
  prepareSearchQuery,
  prepareSearchText,
  splitSuggestionName,
}
export type { SearchQuery, SearchText }
