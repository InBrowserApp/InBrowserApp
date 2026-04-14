import type { JsonSchemaDraft } from "../core/generate-json-schema"
import type { JsonSchemaGeneratorOptions } from "./types"

const SAMPLE_JSON =
  '{\n  "id": "550e8400-e29b-41d4-a716-446655440000",\n  "name": "Ada Lovelace",\n  "email": "ada@example.com",\n  "age": 36,\n  "active": true,\n  "website": "https://example.com",\n  "tags": ["math", "poetry"],\n  "address": {\n    "street": "123 Main St",\n    "city": "London",\n    "postalCode": "SW1A 1AA"\n  },\n  "projects": [\n    { "name": "Analytical Engine", "year": 1843 },\n    { "name": "Notes", "year": 1842, "url": "https://example.com/notes" }\n  ],\n  "lastSeen": "2024-01-20T10:12:30Z",\n  "metadata": null\n}'

const DEFAULT_OPTIONS: JsonSchemaGeneratorOptions = {
  draft: "2020-12",
  inferRequired: true,
  allowAdditionalProperties: true,
  detectFormat: true,
}

const DRAFT_OPTIONS: ReadonlyArray<{
  label: string
  value: JsonSchemaDraft
}> = [
  { label: "2020-12", value: "2020-12" },
  { label: "2019-09", value: "2019-09" },
  { label: "Draft-07", value: "draft-07" },
]

const STORAGE_KEYS = {
  input: "tools:json-schema-generator:input",
  draft: "tools:json-schema-generator:draft",
  inferRequired: "tools:json-schema-generator:infer-required",
  allowAdditionalProperties:
    "tools:json-schema-generator:allow-additional-properties",
  detectFormat: "tools:json-schema-generator:detect-format",
} as const

export { DEFAULT_OPTIONS, DRAFT_OPTIONS, SAMPLE_JSON, STORAGE_KEYS }
