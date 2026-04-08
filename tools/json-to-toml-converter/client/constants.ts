const DEFAULT_JSON = `{
  "title": "TOML Example",
  "owner": {
    "name": "Tom Preston-Werner"
  },
  "database": {
    "ports": [8001, 8001, 8002],
    "enabled": true
  }
}`

const STORAGE_KEYS = {
  jsonText: "tools:json-to-toml-converter:json-text",
} as const

export { DEFAULT_JSON, STORAGE_KEYS }
