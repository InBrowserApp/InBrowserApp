const DEFAULT_JSON = `{
  "hello": "world",
  "items": [1, 2, 3],
  "nested": { "a": true, "b": null }
}`

const STORAGE_KEYS = {
  jsonText: "tools:json-to-yaml-converter:json-text",
} as const

export { DEFAULT_JSON, STORAGE_KEYS }
