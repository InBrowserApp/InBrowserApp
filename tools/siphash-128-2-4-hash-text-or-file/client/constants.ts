const DEFAULT_TEXT = "Hello, keyed hash tables!"
const DEFAULT_KEY_INPUT = "0x000102030405060708090a0b0c0d0e0f"

const STORAGE_KEYS = {
  text: "tools:siphash-128-2-4-hash-text-or-file:text",
  key: "tools:siphash-128-2-4-hash-text-or-file:key",
} as const

export { DEFAULT_KEY_INPUT, DEFAULT_TEXT, STORAGE_KEYS }
