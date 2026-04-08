const DEFAULT_YAML = `title: YAML Example
owner:
  name: Tom Preston-Werner
database:
  ports:
    - 8001
    - 8001
    - 8002
  enabled: true
`

const STORAGE_KEYS = {
  yamlText: "tools:yaml-to-toml-converter:yaml-text",
} as const

export { DEFAULT_YAML, STORAGE_KEYS }
