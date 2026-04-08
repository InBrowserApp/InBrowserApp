import {
  DEFAULT_JSON_TO_CSV_OPTIONS,
  normalizeJsonToCsvOptions,
} from "../core/convert-json-to-csv"
import type { JsonToCsvOptionsStorageValue } from "./types"

function parseStoredOptions(rawValue: string | null) {
  if (!rawValue) {
    return DEFAULT_JSON_TO_CSV_OPTIONS
  }

  try {
    return normalizeJsonToCsvOptions(
      JSON.parse(rawValue) as JsonToCsvOptionsStorageValue
    )
  } catch {
    return DEFAULT_JSON_TO_CSV_OPTIONS
  }
}

export { parseStoredOptions }
