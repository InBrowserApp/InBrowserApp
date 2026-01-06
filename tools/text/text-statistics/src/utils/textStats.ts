export interface TextStats {
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

export function calculateTextStats(text: string): TextStats {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length

  const trimmedText = text.trim()
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0

  const lines = text ? text.split(/\r\n|\r|\n/).length : 0

  const paragraphs = trimmedText ? trimmedText.split(/\n\s*\n/).filter((p) => p.trim()).length : 0

  const sentenceMatches = text.match(/[.!?]+/g)
  const sentences = sentenceMatches ? sentenceMatches.length : trimmedText ? 1 : 0

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

export function formatTime(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60)
    return `${seconds}s`
  }
  const mins = Math.floor(minutes)
  const secs = Math.round((minutes - mins) * 60)
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}
