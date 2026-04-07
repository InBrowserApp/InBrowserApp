export const DEFAULT_SCHEMA = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}`

export const DEFAULT_DATA = `{
  "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "name": "Ada Lovelace",
  "age": 37
}`

export const STORAGE_KEYS = {
  allErrors: "tools:json-schema-validator:all-errors",
  data: "tools:json-schema-validator:data",
  schema: "tools:json-schema-validator:schema",
  validateFormats: "tools:json-schema-validator:validate-formats",
} as const
