import type { InvisibleCategory } from "./core/unicode-invisible"

const STORAGE_KEY_TEXT = "tools:unicode-invisible-character-checker:text"
const STORAGE_KEY_CATEGORIES =
  "tools:unicode-invisible-character-checker:categories"

const DEFAULT_ENABLED_CATEGORIES: readonly InvisibleCategory[] = [
  "zero-width",
  "bidi-control",
  "space-like",
  "format",
]

const SAMPLE_TEXT = [
  "Hello\u200BWorld",
  "Price:\u00A0123\u202FUSD",
  "Order\u00ADID: 42",
  "Direction\u200E/LTR\u200FRTL",
].join("\n")

export {
  DEFAULT_ENABLED_CATEGORIES,
  SAMPLE_TEXT,
  STORAGE_KEY_CATEGORIES,
  STORAGE_KEY_TEXT,
}
