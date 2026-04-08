const DEFAULT_TOML = `title = "TOML Example"

[owner]
name = "Tom Preston-Werner"

[database]
ports = [8001, 8001, 8002]
enabled = true
`

const STORAGE_KEYS = {
  tomlText: "tools:toml-to-yaml-converter:toml-text",
} as const

export { DEFAULT_TOML, STORAGE_KEYS }
