import { DEFAULT_JSON_TO_XML_OPTIONS } from "../core/convert-json-to-xml"

const DEFAULT_JSON = `{
  "project": {
    "name": "InBrowserApp",
    "languages": ["en", "zh-CN", "fr"],
    "published": true,
    "owner": {
      "name": "Open Source Team",
      "email": null
    }
  }
}`

const STORAGE_KEYS = {
  jsonText: "tools:json-to-xml-converter:json-text",
  options: "tools:json-to-xml-converter:options",
} as const

export { DEFAULT_JSON, DEFAULT_JSON_TO_XML_OPTIONS, STORAGE_KEYS }
