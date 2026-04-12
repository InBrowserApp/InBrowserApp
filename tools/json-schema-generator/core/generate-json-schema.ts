export type JsonSchemaDraft = "2020-12" | "2019-09" | "draft-07"

export interface JsonSchemaGenerateOptions {
  draft?: JsonSchemaDraft
  inferRequired?: boolean
  allowAdditionalProperties?: boolean
  detectFormat?: boolean
}

type SchemaObject = Record<string, unknown>

const DRAFT_SCHEMA_IDS: Record<JsonSchemaDraft, string> = {
  "2020-12": "https://json-schema.org/draft/2020-12/schema",
  "2019-09": "https://json-schema.org/draft/2019-09/schema",
  "draft-07": "http://json-schema.org/draft-07/schema",
}

function generateJsonSchema(
  data: unknown,
  options: JsonSchemaGenerateOptions = {}
): SchemaObject {
  const draft = options.draft ?? "2020-12"
  const schema = buildSchema(data, options)

  return {
    $schema: DRAFT_SCHEMA_IDS[draft],
    ...schema,
  }
}

function buildSchema(
  data: unknown,
  options: JsonSchemaGenerateOptions
): SchemaObject {
  if (data === null) {
    return { type: "null" }
  }

  if (Array.isArray(data)) {
    return buildArraySchema(data, options)
  }

  switch (typeof data) {
    case "string":
      return buildStringSchema(data, options)
    case "number":
      return { type: Number.isInteger(data) ? "integer" : "number" }
    case "boolean":
      return { type: "boolean" }
    case "object":
      return buildObjectSchema(data as Record<string, unknown>, options)
    default:
      return {}
  }
}

function buildStringSchema(
  value: string,
  options: JsonSchemaGenerateOptions
): SchemaObject {
  const schema: SchemaObject = { type: "string" }

  if (options.detectFormat !== false) {
    const format = detectStringFormat(value)
    if (format) {
      schema.format = format
    }
  }

  return schema
}

function buildArraySchema(
  values: unknown[],
  options: JsonSchemaGenerateOptions
): SchemaObject {
  if (values.length === 0) {
    return { type: "array", items: {} }
  }

  const items = values.map((value) => buildSchema(value, options))

  return {
    type: "array",
    items: mergeSchemas(items, options),
  }
}

function buildObjectSchema(
  value: Record<string, unknown>,
  options: JsonSchemaGenerateOptions
): SchemaObject {
  const properties: Record<string, SchemaObject> = {}
  const keys = Object.keys(value)

  for (const key of keys) {
    properties[key] = buildSchema(value[key], options)
  }

  const schema: SchemaObject = {
    type: "object",
    properties,
  }

  if (options.inferRequired !== false && keys.length > 0) {
    schema.required = keys
  }

  if (options.allowAdditionalProperties === false) {
    schema.additionalProperties = false
  }

  return schema
}

function mergeSchemas(
  schemas: SchemaObject[],
  options: JsonSchemaGenerateOptions
): SchemaObject {
  const uniqueSchemas = dedupeSchemas(schemas)

  if (uniqueSchemas.length === 1) {
    return uniqueSchemas[0]!
  }

  const types = uniqueSchemas.map(getSchemaType)

  if (types.every((type) => type === "object")) {
    return mergeObjectSchemas(uniqueSchemas, options)
  }

  if (types.every((type) => type === "array")) {
    return mergeArraySchemas(uniqueSchemas, options)
  }

  if (types.every((type) => type === "number" || type === "integer")) {
    return { type: "number" }
  }

  if (types.every((type) => type === "string")) {
    return { type: "string" }
  }

  return { anyOf: uniqueSchemas }
}

function mergeObjectSchemas(
  schemas: SchemaObject[],
  options: JsonSchemaGenerateOptions
): SchemaObject {
  const propertyMap = new Map<string, SchemaObject[]>()
  const propertyOrder: string[] = []
  const requiredSets: Set<string>[] = []

  for (const schema of schemas) {
    const properties = schema.properties as Record<string, SchemaObject>

    for (const key of Object.keys(properties)) {
      if (!propertyMap.has(key)) {
        propertyMap.set(key, [])
        propertyOrder.push(key)
      }

      propertyMap.get(key)!.push(properties[key]!)
    }

    if (options.inferRequired !== false) {
      const required = Array.isArray(schema.required)
        ? schema.required.filter(
            (item): item is string => typeof item === "string"
          )
        : Object.keys(properties)
      requiredSets.push(new Set(required))
    }
  }

  const mergedProperties: Record<string, SchemaObject> = {}

  for (const key of propertyOrder) {
    mergedProperties[key] = mergeSchemas(propertyMap.get(key)!, options)
  }

  const mergedSchema: SchemaObject = {
    type: "object",
    properties: mergedProperties,
  }

  if (options.inferRequired !== false && requiredSets.length > 0) {
    const required = propertyOrder.filter((key) =>
      requiredSets.every((requiredSet) => requiredSet.has(key))
    )

    if (required.length > 0) {
      mergedSchema.required = required
    }
  }

  if (options.allowAdditionalProperties === false) {
    mergedSchema.additionalProperties = false
  }

  return mergedSchema
}

function mergeArraySchemas(
  schemas: SchemaObject[],
  options: JsonSchemaGenerateOptions
): SchemaObject {
  const itemSchemas = schemas.map((schema) => schema.items as SchemaObject)

  return {
    type: "array",
    items: mergeSchemas(itemSchemas, options),
  }
}

function getSchemaType(schema: SchemaObject): string {
  return typeof schema.type === "string" ? schema.type : ""
}

function dedupeSchemas(schemas: SchemaObject[]): SchemaObject[] {
  const seen = new Map<string, SchemaObject>()

  for (const schema of schemas) {
    const key = stableStringify(schema)
    if (!seen.has(key)) {
      seen.set(key, schema)
    }
  }

  return Array.from(seen.values())
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => left.localeCompare(right)
    )

    return `{${entries
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`
  }

  return JSON.stringify(value)
}

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
const DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/

function detectStringFormat(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  if (UUID_REGEX.test(trimmed)) {
    return "uuid"
  }

  if (isEmailLike(trimmed)) {
    return "email"
  }

  if (DATE_TIME_REGEX.test(trimmed)) {
    return "date-time"
  }

  if (isUri(trimmed)) {
    return "uri"
  }

  return undefined
}

function isUri(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function isEmailLike(value: string): boolean {
  if (value.includes(" ")) {
    return false
  }

  const atIndex = value.indexOf("@")
  if (atIndex <= 0 || atIndex !== value.lastIndexOf("@")) {
    return false
  }

  const local = value.slice(0, atIndex)
  const domain = value.slice(atIndex + 1)

  if (!local || !domain) {
    return false
  }

  if (!domain.includes(".")) {
    return false
  }

  if (domain.startsWith(".") || domain.endsWith(".")) {
    return false
  }

  if (domain.includes("..")) {
    return false
  }

  return true
}

export { generateJsonSchema }
