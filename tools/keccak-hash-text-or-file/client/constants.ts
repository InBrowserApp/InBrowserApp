const DEFAULT_TEXT = "Hello, browser-native world!"

const STORAGE_KEYS = {
  text: "tools:keccak-hash-text-or-file:text",
} as const

const DEFAULT_OUTPUT_LENGTH = 256 as const

export { DEFAULT_OUTPUT_LENGTH, DEFAULT_TEXT, STORAGE_KEYS }
