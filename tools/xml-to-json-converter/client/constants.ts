import { DEFAULT_XML_TO_JSON_OPTIONS } from "../core/convert-xml-to-json"

const DEFAULT_XML = `<?xml version="1.0" encoding="utf-8"?>
<note importance="high" logged="true">
  <title>Happy</title>
  <todo>Work</todo>
  <todo>Play</todo>
</note>`

const STORAGE_KEYS = {
  xmlText: "tools:xml-to-json-converter:xml-text",
  options: "tools:xml-to-json-converter:options",
} as const

export { DEFAULT_XML, DEFAULT_XML_TO_JSON_OPTIONS, STORAGE_KEYS }
