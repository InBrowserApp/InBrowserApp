const DEFAULT_KEY_INPUT =
  "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
const DEFAULT_OUTPUT_SIZE = 64
const DEFAULT_TEXT = "Hello, keyed HighwayHash world!"

const STORAGE_KEYS = {
  text: "tools:highwayhash-hash-text-or-file:text",
  key: "tools:highwayhash-hash-text-or-file:key",
  outputSize: "tools:highwayhash-hash-text-or-file:output-size",
} as const

export { DEFAULT_KEY_INPUT, DEFAULT_OUTPUT_SIZE, DEFAULT_TEXT, STORAGE_KEYS }
