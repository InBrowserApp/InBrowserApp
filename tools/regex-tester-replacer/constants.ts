import type { RegexFlag, RegexResultView } from "./core/regex-tester-replacer"

const DEFAULT_SOURCE_TEXT = "Order #123-ABC\nOrder #456-DEF"
const DEFAULT_PATTERN = "#(\\d+)-([A-Z]+)"
const DEFAULT_REPLACEMENT = "ID:$1 Code:$2"
const DEFAULT_FLAGS: readonly RegexFlag[] = ["g"]
const DEFAULT_RESULT_VIEW: RegexResultView = "preview"
const MATCH_LIMIT = 200
const PREVIEW_LIMIT = 5000

const STORAGE_KEYS = {
  sourceText: "tools:regex-tester-replacer:source-text",
  pattern: "tools:regex-tester-replacer:pattern",
  replacement: "tools:regex-tester-replacer:replacement",
  flags: "tools:regex-tester-replacer:flags",
  activeResultView: "tools:regex-tester-replacer:active-result-view",
} as const

export {
  DEFAULT_FLAGS,
  DEFAULT_PATTERN,
  DEFAULT_REPLACEMENT,
  DEFAULT_RESULT_VIEW,
  DEFAULT_SOURCE_TEXT,
  MATCH_LIMIT,
  PREVIEW_LIMIT,
  STORAGE_KEYS,
}
