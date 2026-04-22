const DEFAULT_TEXT = "Hello, browser-native world!"
const DEFAULT_OUTPUT_LENGTH = 256

const STORAGE_KEYS = {
  text: "tools:blake3-hash-text-or-file:text",
} as const

export { DEFAULT_OUTPUT_LENGTH, DEFAULT_TEXT, STORAGE_KEYS }
