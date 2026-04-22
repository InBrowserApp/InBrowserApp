import type { TextDiffCompareOptions } from "./core/text-diff"
import type { TextDiffSettings } from "./types"

const DEFAULT_ORIGINAL_TEXT = `function buildGreeting(name) {
  return "Hello, " + name + "!"
}

console.log(buildGreeting("Ada"))
`

const DEFAULT_MODIFIED_TEXT = `function buildGreeting(name, punctuation = "!") {
  return \`Hello, \${name}\${punctuation}\`
}

console.info(buildGreeting("Ada"))
`

const DEFAULT_COMPARE_OPTIONS: TextDiffCompareOptions = {
  ignoreCase: false,
  ignoreWhitespace: false,
}

const DEFAULT_SETTINGS: TextDiffSettings = {
  compareOptions: DEFAULT_COMPARE_OPTIONS,
  viewMode: "side-by-side",
  hideUnchanged: false,
}

const STORAGE_KEYS = {
  originalText: "tools:text-diff:original-text",
  modifiedText: "tools:text-diff:modified-text",
  settings: "tools:text-diff:settings",
} as const

const FILE_ACCEPT =
  ".txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.scss,.html,.xml,.yml,.yaml,.csv,text/plain"

export {
  DEFAULT_COMPARE_OPTIONS,
  DEFAULT_MODIFIED_TEXT,
  DEFAULT_ORIGINAL_TEXT,
  DEFAULT_SETTINGS,
  FILE_ACCEPT,
  STORAGE_KEYS,
}
