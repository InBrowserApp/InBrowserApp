import { DEFAULT_CSV_TO_JSON_OPTIONS } from "../core/convert-csv-to-json"

const DEFAULT_CSV = `name,age,email
Ada,36,ada@example.com
Linus,32,linus@example.com`

const STORAGE_KEYS = {
  csvText: "tools:csv-to-json-converter:csv-text",
  options: "tools:csv-to-json-converter:options",
} as const

export { DEFAULT_CSV, DEFAULT_CSV_TO_JSON_OPTIONS, STORAGE_KEYS }
