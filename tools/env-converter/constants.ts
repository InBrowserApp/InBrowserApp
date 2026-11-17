import type { Direction, Format, Messages } from "./types"

export const DIRECTIONS: {
  value: Direction
  label: keyof Messages
  from: Format
  to: Format
}[] = [
  { value: "env-json", label: "envToJsonLabel", from: "env", to: "json" },
  { value: "json-env", label: "jsonToEnvLabel", from: "json", to: "env" },
  { value: "env-yaml", label: "envToYamlLabel", from: "env", to: "yaml" },
  { value: "yaml-env", label: "yamlToEnvLabel", from: "yaml", to: "env" },
]
export const SAMPLE_ENV =
  '# Application settings\nAPP_NAME="My app"\nPORT=3000\nDEBUG=false\nCODE=0012\nAPI_URL=https://example.com/api\nGREETING="Hello #world"'
export const FORMAT_LABELS = { env: ".env", json: "JSON", yaml: "YAML" }
export const FILE_TYPES = {
  env: "",
  json: ".json,.txt,application/json,text/plain",
  yaml: ".yaml,.yml,.txt,application/yaml,text/yaml,text/plain",
}
