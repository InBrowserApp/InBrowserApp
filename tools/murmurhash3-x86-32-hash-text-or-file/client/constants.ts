const DEFAULT_TEXT = "I will not buy this record, it is scratched."
const DEFAULT_SEED = "0"

const STORAGE_KEYS = {
  text: "tools:murmurhash3-x86-32-hash-text-or-file:text",
} as const

export { DEFAULT_SEED, DEFAULT_TEXT, STORAGE_KEYS }
