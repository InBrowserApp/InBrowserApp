import type { HashAlgorithm } from "../core/hash"

const DEFAULT_TEXT = "Hello, browser-native world!"
const DEFAULT_ALGORITHM = "SHA-256" satisfies HashAlgorithm

const STORAGE_KEYS = {
  algorithm: "tools:hash-text-or-file-template:algorithm",
  text: "tools:hash-text-or-file-template:text",
} as const

export { DEFAULT_ALGORITHM, DEFAULT_TEXT, STORAGE_KEYS }
