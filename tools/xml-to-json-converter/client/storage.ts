import {
  DEFAULT_XML_TO_JSON_OPTIONS,
  normalizeXmlToJsonOptions,
} from "../core/convert-xml-to-json"
import type { XmlToJsonOptionsStorageValue } from "./types"

function parseStoredOptions(rawValue: string | null) {
  if (!rawValue) {
    return DEFAULT_XML_TO_JSON_OPTIONS
  }

  try {
    return normalizeXmlToJsonOptions(
      JSON.parse(rawValue) as XmlToJsonOptionsStorageValue
    )
  } catch {
    return DEFAULT_XML_TO_JSON_OPTIONS
  }
}

export { parseStoredOptions }
