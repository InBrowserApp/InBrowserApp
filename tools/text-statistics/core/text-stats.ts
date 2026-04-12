type RepeatedTerm = Readonly<{
  term: string
  count: number
}>

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  uniqueWords: number
  lines: number
  paragraphs: number
  sentences: number
  averageWordLength: number
  averageSentenceWords: number
  lexicalDiversity: number
  longestSentenceWords: number
  longestParagraphWords: number
  readingTimeMinutes: number
  speakingTimeMinutes: number
  topTerms: readonly RepeatedTerm[]
}

const READING_WPM = 220
const SPEAKING_WPM = 150
const MAX_TOP_TERMS = 8
const FALLBACK_WORD_PATTERN = /[\p{L}\p{M}\p{N}]+(?:['’-][\p{L}\p{M}\p{N}]+)*/gu
const LETTER_PATTERN = /\p{L}/u
const FALLBACK_SENTENCE_PATTERN = /[^.!?。！？\n]+[.!?。！？]?/gu

const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null

const wordSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "word" })
    : null

const sentenceSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "sentence" })
    : null

function countGraphemes(text: string) {
  if (!text) {
    return 0
  }

  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(text)).length
  }

  return Array.from(text).length
}

function getWordTokens(text: string) {
  const normalizedText = text.normalize("NFKC")

  if (wordSegmenter) {
    return Array.from(wordSegmenter.segment(normalizedText))
      .filter((segment) => segment.isWordLike)
      .map((segment) => segment.segment.trim())
      .filter((segment) => segment !== "" && LETTER_PATTERN.test(segment))
      .map((segment) => segment.toLocaleLowerCase())
  }

  return (
    normalizedText
      .match(FALLBACK_WORD_PATTERN)
      ?.map((segment) => segment.toLocaleLowerCase()) ?? []
  )
}

function getSentences(text: string) {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return []
  }

  if (sentenceSegmenter) {
    return Array.from(sentenceSegmenter.segment(trimmedText))
      .map((segment) => segment.segment.trim())
      .filter(Boolean)
  }

  return (
    trimmedText
      .match(FALLBACK_SENTENCE_PATTERN)
      ?.map((segment) => segment.trim()) ?? []
  )
}

function getParagraphs(text: string) {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return []
  }

  return trimmedText
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim() !== "")
}

function getTopTerms(tokens: readonly string[]) {
  const counts = new Map<string, number>()

  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1]
      }

      return left[0].localeCompare(right[0])
    })
    .slice(0, MAX_TOP_TERMS)
    .map(([term, count]) => ({ term, count }))
}

function calculateTextStats(text: string): TextStats {
  const tokens = getWordTokens(text)
  const sentences = getSentences(text)
  const paragraphs = getParagraphs(text)
  const uniqueWords = new Set(tokens).size
  const words = tokens.length
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0
  const characters = countGraphemes(text)
  const charactersNoSpaces = countGraphemes(text.replace(/\s/g, ""))
  const totalWordLength = tokens.reduce(
    (total, token) => total + countGraphemes(token),
    0
  )
  const longestSentenceWords = sentences.reduce((longest, sentence) => {
    return Math.max(longest, getWordTokens(sentence).length)
  }, 0)
  const longestParagraphWords = paragraphs.reduce((longest, paragraph) => {
    return Math.max(longest, getWordTokens(paragraph).length)
  }, 0)

  return {
    characters,
    charactersNoSpaces,
    words,
    uniqueWords,
    lines,
    paragraphs: paragraphs.length,
    sentences: sentences.length,
    averageWordLength: words ? totalWordLength / words : 0,
    averageSentenceWords: sentences.length ? words / sentences.length : 0,
    lexicalDiversity: words ? uniqueWords / words : 0,
    longestSentenceWords,
    longestParagraphWords,
    readingTimeMinutes: words / READING_WPM,
    speakingTimeMinutes: words / SPEAKING_WPM,
    topTerms: getTopTerms(tokens),
  }
}

function formatTime(minutes: number) {
  if (minutes <= 0) {
    return "0s"
  }

  if (minutes < 1) {
    return `${Math.max(1, Math.round(minutes * 60))}s`
  }

  const wholeMinutes = Math.floor(minutes)
  const seconds = Math.round((minutes - wholeMinutes) * 60)

  return seconds > 0 ? `${wholeMinutes}m ${seconds}s` : `${wholeMinutes}m`
}

export { calculateTextStats, formatTime }
