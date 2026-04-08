import {
  DEFAULT_CSV_TO_JSON_OPTIONS,
  normalizeCsvToJsonOptions,
} from "../core/convert-csv-to-json"
import type { CsvToJsonOptionsStorageValue } from "./types"

function parseStoredOptions(rawValue: string | null) {
  if (!rawValue) {
    return DEFAULT_CSV_TO_JSON_OPTIONS
  }

  try {
    return normalizeCsvToJsonOptions(
      JSON.parse(rawValue) as CsvToJsonOptionsStorageValue
    )
  } catch {
    return DEFAULT_CSV_TO_JSON_OPTIONS
  }
}

export { parseStoredOptions }
