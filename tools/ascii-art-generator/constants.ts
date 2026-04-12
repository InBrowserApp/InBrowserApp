const SAMPLE_TEXT = `Launch notes
ship today`

const DEFAULT_TEXT = ""

const STORAGE_KEYS = {
  text: "tools:ascii-art-generator:text",
  options: "tools:ascii-art-generator:options",
} as const

export { DEFAULT_TEXT, SAMPLE_TEXT, STORAGE_KEYS }
