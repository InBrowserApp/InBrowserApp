import type {
  DelimiterMode,
  ListComparerOptions,
  ListResultKey,
} from "./core/compare-lists"

const STORAGE_KEYS = {
  leftText: "tools:list-comparer:left-text",
  rightText: "tools:list-comparer:right-text",
  options: "tools:list-comparer:options",
  activeResult: "tools:list-comparer:active-result",
} as const

const DEFAULT_CUSTOM_DELIMITER = "|"
const DEFAULT_DELIMITER_MODE: DelimiterMode = "newline"
const DEFAULT_RESULT_KEY: ListResultKey = "shared"

const DEFAULT_OPTIONS: ListComparerOptions = {
  delimiterMode: DEFAULT_DELIMITER_MODE,
  customDelimiter: DEFAULT_CUSTOM_DELIMITER,
  trimItems: true,
  ignoreCase: false,
  omitEmptyItems: true,
  sortResults: false,
}

const DEFAULT_LEFT_SAMPLE = [
  "banana",
  "kiwi",
  "banana",
  "mango",
  "pear",
  "apple",
].join("\n")

const DEFAULT_RIGHT_SAMPLE = [
  "kiwi",
  "grape",
  "apple",
  "apple",
  "melon",
  "banana",
].join("\n")

export {
  DEFAULT_LEFT_SAMPLE,
  DEFAULT_OPTIONS,
  DEFAULT_RESULT_KEY,
  DEFAULT_RIGHT_SAMPLE,
  STORAGE_KEYS,
}
