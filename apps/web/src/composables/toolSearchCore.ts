export type SearchableToolMeta = Record<
  string,
  {
    name?: string
    description?: string
  }
>

export type SearchableTool = {
  toolID: string
  tags: readonly string[]
  meta: SearchableToolMeta
}

type SearchScore = {
  toolID: string
  score: number
}

const segmentWords = (queryValue: string, locale: string): string[] => {
  const words: string[] = []

  if (Intl?.Segmenter) {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'word' })
    const segments = segmenter.segment(queryValue)
    for (const segment of segments) {
      if (segment.isWordLike && segment.segment.trim()) {
        words.push(segment.segment.toLowerCase().trim())
      }
    }
    return words
  }

  return queryValue
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
}

const normalize = (value: string | undefined): string => value?.toLowerCase() ?? ''

const matchAcrossLanguages = (
  tool: SearchableTool,
  currentLang: string,
  word: string,
  score: number,
): number => {
  let nextScore = score

  for (const [lang, localizedMeta] of Object.entries(tool.meta)) {
    if (lang === currentLang) {
      continue
    }

    const name = normalize(localizedMeta.name)
    const description = normalize(localizedMeta.description)

    if (name.includes(word)) {
      nextScore += 5
    }
    if (description.includes(word)) {
      nextScore += 3
    }
  }

  return nextScore
}

const boostForMultiWords = (
  words: string[],
  currentName: string,
  currentDesc: string,
  tagsText: string,
  toolID: string,
): number => {
  if (words.length <= 1) {
    return 0
  }

  const wordMatchCount = words.filter(
    (word) =>
      currentName.includes(word) ||
      currentDesc.includes(word) ||
      tagsText.includes(word) ||
      toolID.includes(word),
  ).length

  if (wordMatchCount === words.length) {
    return 30
  }
  if (wordMatchCount > 1) {
    return wordMatchCount * 5
  }
  return 0
}

const scoreTool = (
  tool: SearchableTool,
  queryValue: string,
  words: string[],
  locale: string,
): number => {
  const currentLang = tool.meta[locale] ? locale : 'en'
  const currentMeta = tool.meta[currentLang] ?? {}
  const currentName = normalize(currentMeta.name)
  const currentDesc = normalize(currentMeta.description)
  const toolID = tool.toolID.toLowerCase()
  const tagsText = tool.tags.join(' ').toLowerCase()

  let score = 0

  if (currentName.includes(queryValue)) {
    score += 100
  }
  if (currentDesc.includes(queryValue)) {
    score += 50
  }
  if (tagsText.includes(queryValue)) {
    score += 80
  }

  for (const word of words) {
    if (!word) {
      continue
    }

    if (currentName.includes(word)) {
      score += 20
    }
    if (currentDesc.includes(word)) {
      score += 10
    }

    score = matchAcrossLanguages(tool, currentLang, word, score)

    for (const tag of tool.tags) {
      if (tag.toLowerCase().includes(word)) {
        score += 15
      }
    }

    if (toolID.includes(word)) {
      score += 8
    }
  }

  score += boostForMultiWords(words, currentName, currentDesc, tagsText, toolID)

  return score
}

export const searchToolIDs = (tools: SearchableTool[], query: string, locale: string): string[] => {
  const queryValue = query.toLowerCase().trim()

  if (!queryValue) {
    return tools.map((tool) => tool.toolID)
  }

  const words = segmentWords(queryValue, locale)
  const scoredTools: SearchScore[] = []

  for (const tool of tools) {
    const score = scoreTool(tool, queryValue, words, locale)

    if (score > 0) {
      scoredTools.push({
        toolID: tool.toolID,
        score,
      })
    }
  }

  return scoredTools.sort((a, b) => b.score - a.score).map((item) => item.toolID)
}
