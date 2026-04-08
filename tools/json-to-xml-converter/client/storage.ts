import {
  DEFAULT_JSON_TO_XML_OPTIONS,
  normalizeJsonToXmlOptions,
} from "../core/convert-json-to-xml"
import type { JsonToXmlOptionsStorageValue } from "./types"

function parseStoredOptions(rawValue: string | null) {
  if (!rawValue) {
    return DEFAULT_JSON_TO_XML_OPTIONS
  }

  try {
    return normalizeJsonToXmlOptions(
      JSON.parse(rawValue) as JsonToXmlOptionsStorageValue
    )
  } catch {
    return DEFAULT_JSON_TO_XML_OPTIONS
  }
}

export { parseStoredOptions }
