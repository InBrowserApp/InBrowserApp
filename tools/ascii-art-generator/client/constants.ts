const SAMPLE_TEXT = `Launch notes
ship today`

const DEFAULT_TEXT = "Hello"

const STORAGE_KEYS = {
  text: "tools:ascii-art-generator:text",
  font: "tools:ascii-art-generator:font",
  align: "tools:ascii-art-generator:align",
  width: "tools:ascii-art-generator:width",
} as const

export { DEFAULT_TEXT, SAMPLE_TEXT, STORAGE_KEYS }
