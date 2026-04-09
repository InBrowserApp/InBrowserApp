import type { JsonDiffOperation } from "../core/json-diff"

const DEFAULT_ORIGINAL_TEXT = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "roles": ["reader", "editor"]
  },
  "active": true
}`

const DEFAULT_MODIFIED_TEXT = `{
  "user": {
    "id": 1,
    "name": "Alice Chen",
    "roles": ["reader", "editor", "admin"]
  },
  "active": false,
  "region": "us-east-1"
}`

const DEFAULT_SELECTED_OPERATIONS: readonly JsonDiffOperation[] = [
  "add",
  "remove",
  "replace",
]

const LARGE_JSON_INPUT_THRESHOLD = 120_000

const STORAGE_KEYS = {
  activeResultMode: "tools:json-diff-path:active-result-mode",
  modifiedText: "tools:json-diff-path:modified",
  originalText: "tools:json-diff-path:original",
  selectedOperations: "tools:json-diff-path:selected-operations",
} as const

export {
  DEFAULT_MODIFIED_TEXT,
  DEFAULT_ORIGINAL_TEXT,
  DEFAULT_SELECTED_OPERATIONS,
  LARGE_JSON_INPUT_THRESHOLD,
  STORAGE_KEYS,
}
