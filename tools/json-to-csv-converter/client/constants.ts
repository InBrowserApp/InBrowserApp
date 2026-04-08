import { DEFAULT_JSON_TO_CSV_OPTIONS } from "../core/convert-json-to-csv"

const DEFAULT_JSON = `[
  {
    "name": "Ada",
    "age": 36,
    "email": "ada@example.com"
  },
  {
    "name": "Linus",
    "age": 32,
    "email": "linus@example.com"
  }
]`

const STORAGE_KEYS = {
  jsonText: "tools:json-to-csv-converter:json-text",
  options: "tools:json-to-csv-converter:options",
} as const

export { DEFAULT_JSON, DEFAULT_JSON_TO_CSV_OPTIONS, STORAGE_KEYS }
