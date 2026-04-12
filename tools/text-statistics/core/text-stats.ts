interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  paragraphs: number
  sentences: number
  readingTimeMinutes: number
  speakingTimeMinutes: number
}

const READING_WPM = 200
const SPEAKING_WPM = 150

function calculateTextStats(text: string): TextStats {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, "").length

  const trimmedText = text.trim()
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0
  const paragraphs = trimmedText
    ? trimmedText.split(/\n\s*\n/).filter((paragraph) => paragraph.trim())
        .length
    : 0

  const sentenceMatches = text.match(/[.!?]+/g)
  const sentences = sentenceMatches
    ? sentenceMatches.length
    : trimmedText
      ? 1
      : 0

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    sentences,
    readingTimeMinutes: words / READING_WPM,
    speakingTimeMinutes: words / SPEAKING_WPM,
  }
}

function formatTime(minutes: number) {
  if (minutes < 1) {
    return `${Math.round(minutes * 60)}s`
  }

  const wholeMinutes = Math.floor(minutes)
  const seconds = Math.round((minutes - wholeMinutes) * 60)

  return seconds > 0 ? `${wholeMinutes}m ${seconds}s` : `${wholeMinutes}m`
}

export { calculateTextStats, formatTime }
