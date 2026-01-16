import Ajv, { type ErrorObject, type Options } from 'ajv'
import Ajv2019 from 'ajv/dist/2019'
import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json'

export type JsonSchemaDraft = '2020-12' | '2019-09' | 'draft-07'

export interface SchemaDraftInfo {
  draft: JsonSchemaDraft
  detected: boolean
  raw?: string
}

export interface JsonSchemaGenerateOptions {
  draft?: JsonSchemaDraft
  inferRequired?: boolean
  allowAdditionalProperties?: boolean
  detectFormat?: boolean
}

export interface JsonSchemaValidationError {
  instancePath: string
  schemaPath: string
  keyword: string
  message: string
  params: Record<string, unknown>
}

export interface JsonSchemaValidationResult {
  valid: boolean
  errors: JsonSchemaValidationError[]
  draft: JsonSchemaDraft
  detected: boolean
  schemaError?: string
}

export interface JsonSchemaValidateOptions {
  allErrors?: boolean
  validateFormats?: boolean
  strict?: boolean
}

const DRAFT_2020_12_IDS = new Set([
  'https://json-schema.org/draft/2020-12/schema',
  'http://json-schema.org/draft/2020-12/schema',
  'https://json-schema.org/draft/2020-12/schema#',
  'http://json-schema.org/draft/2020-12/schema#',
])

const DRAFT_2019_09_IDS = new Set([
  'https://json-schema.org/draft/2019-09/schema',
  'http://json-schema.org/draft/2019-09/schema',
  'https://json-schema.org/draft/2019-09/schema#',
  'http://json-schema.org/draft/2019-09/schema#',
])

const DRAFT_07_IDS = new Set([
  'http://json-schema.org/draft-07/schema',
  'https://json-schema.org/draft-07/schema',
  'http://json-schema.org/draft-07/schema#',
  'https://json-schema.org/draft-07/schema#',
])

const DRAFT_SCHEMA_IDS: Record<JsonSchemaDraft, string> = {
  '2020-12': 'https://json-schema.org/draft/2020-12/schema',
  '2019-09': 'https://json-schema.org/draft/2019-09/schema',
  'draft-07': 'http://json-schema.org/draft-07/schema',
}

function normalizeSchemaId(schemaId: string): string {
  return schemaId.trim()
}

export function detectSchemaDraft(schema: unknown): SchemaDraftInfo {
  if (!schema || typeof schema !== 'object') {
    return { draft: '2020-12', detected: false }
  }

  const raw = (schema as { $schema?: unknown }).$schema
  if (typeof raw !== 'string') {
    return { draft: '2020-12', detected: false }
  }

  const normalized = normalizeSchemaId(raw)
  if (DRAFT_2020_12_IDS.has(normalized)) {
    return { draft: '2020-12', detected: true, raw }
  }
  if (DRAFT_2019_09_IDS.has(normalized)) {
    return { draft: '2019-09', detected: true, raw }
  }
  if (DRAFT_07_IDS.has(normalized)) {
    return { draft: 'draft-07', detected: true, raw }
  }

  return { draft: '2020-12', detected: false, raw }
}

function createAjv(draft: JsonSchemaDraft, options: JsonSchemaValidateOptions): Ajv {
  const ajvOptions: Options = {
    allErrors: options.allErrors ?? true,
    allowUnionTypes: true,
    strict: options.strict ?? false,
  }

  let ajv: Ajv
  if (draft === '2019-09') {
    ajv = new Ajv2019(ajvOptions)
  } else if (draft === 'draft-07') {
    ajv = new Ajv({ ...ajvOptions, schemaId: '$id', meta: false })
    ajv.addMetaSchema(draft7MetaSchema)
    if (draft7MetaSchema.$id) {
      ajv.opts.defaultMeta = draft7MetaSchema.$id
    }
  } else {
    ajv = new Ajv2020(ajvOptions)
  }

  if (options.validateFormats !== false) {
    addFormats(ajv)
  }

  return ajv
}

function normalizeErrors(errors: ErrorObject[] | null | undefined): JsonSchemaValidationError[] {
  if (!errors || errors.length === 0) return []

  return errors.map((error) => ({
    instancePath: error.instancePath ? error.instancePath : '/',
    schemaPath: error.schemaPath,
    keyword: error.keyword,
    message: error.message ?? '',
    params: error.params ?? {},
  }))
}

export function validateJsonSchema(
  schema: Record<string, unknown>,
  data: unknown,
  options: JsonSchemaValidateOptions = {},
): JsonSchemaValidationResult {
  const draftInfo = detectSchemaDraft(schema)
  const ajv = createAjv(draftInfo.draft, options)

  try {
    const validate = ajv.compile(schema)
    const valid = validate(data)
    return {
      valid: Boolean(valid),
      errors: normalizeErrors(validate.errors),
      draft: draftInfo.draft,
      detected: draftInfo.detected,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      valid: false,
      errors: [],
      draft: draftInfo.draft,
      detected: draftInfo.detected,
      schemaError: message,
    }
  }
}

type SchemaObject = Record<string, unknown>

export function generateJsonSchema(
  data: unknown,
  options: JsonSchemaGenerateOptions = {},
): SchemaObject {
  const draft = options.draft ?? '2020-12'
  const schema = buildSchema(data, options)
  return { $schema: DRAFT_SCHEMA_IDS[draft], ...schema }
}

function buildSchema(data: unknown, options: JsonSchemaGenerateOptions): SchemaObject {
  if (data === null) {
    return { type: 'null' }
  }

  if (Array.isArray(data)) {
    return buildArraySchema(data, options)
  }

  switch (typeof data) {
    case 'string':
      return buildStringSchema(data, options)
    case 'number':
      return { type: Number.isInteger(data) ? 'integer' : 'number' }
    case 'boolean':
      return { type: 'boolean' }
    case 'object':
      return buildObjectSchema(data as Record<string, unknown>, options)
    default:
      return {}
  }
}

function buildStringSchema(value: string, options: JsonSchemaGenerateOptions): SchemaObject {
  const schema: SchemaObject = { type: 'string' }
  if (options.detectFormat !== false) {
    const format = detectStringFormat(value)
    if (format) {
      schema.format = format
    }
  }
  return schema
}

function buildArraySchema(values: unknown[], options: JsonSchemaGenerateOptions): SchemaObject {
  if (values.length === 0) {
    return { type: 'array', items: {} }
  }

  const items = values.map((value) => buildSchema(value, options))
  return { type: 'array', items: mergeSchemas(items, options) }
}

function buildObjectSchema(
  value: Record<string, unknown>,
  options: JsonSchemaGenerateOptions,
): SchemaObject {
  const properties: Record<string, SchemaObject> = {}
  const keys = Object.keys(value)

  for (const key of keys) {
    properties[key] = buildSchema(value[key], options)
  }

  const schema: SchemaObject = {
    type: 'object',
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

function mergeSchemas(schemas: SchemaObject[], options: JsonSchemaGenerateOptions): SchemaObject {
  const uniqueSchemas = dedupeSchemas(schemas)
  if (uniqueSchemas.length === 1) {
    return uniqueSchemas[0]!
  }

  const types = uniqueSchemas.map(getSchemaType)
  if (types.every((type) => type === 'object')) {
    return mergeObjectSchemas(uniqueSchemas, options)
  }

  if (types.every((type) => type === 'array')) {
    return mergeArraySchemas(uniqueSchemas, options)
  }

  if (types.every((type) => type === 'number' || type === 'integer')) {
    return { type: types.includes('number') ? 'number' : 'integer' }
  }

  if (types.every((type) => type === 'string')) {
    const format = resolveSharedFormat(uniqueSchemas)
    return format ? { type: 'string', format } : { type: 'string' }
  }

  if (types.every((type) => type === 'boolean')) {
    return { type: 'boolean' }
  }

  if (types.every((type) => type === 'null')) {
    return { type: 'null' }
  }

  return { anyOf: uniqueSchemas }
}

function mergeObjectSchemas(
  schemas: SchemaObject[],
  options: JsonSchemaGenerateOptions,
): SchemaObject {
  const propertyMap = new Map<string, SchemaObject[]>()
  const propertyOrder: string[] = []
  const requiredSets: Set<string>[] = []

  for (const schema of schemas) {
    const properties = (schema.properties as Record<string, SchemaObject> | undefined) ?? {}
    for (const key of Object.keys(properties)) {
      if (!propertyMap.has(key)) {
        propertyMap.set(key, [])
        propertyOrder.push(key)
      }
      propertyMap.get(key)!.push(properties[key]!)
    }

    if (options.inferRequired !== false) {
      const required = Array.isArray(schema.required)
        ? schema.required.filter((item) => typeof item === 'string')
        : Object.keys(properties)
      requiredSets.push(new Set(required))
    }
  }

  const mergedProperties: Record<string, SchemaObject> = {}
  for (const key of propertyOrder) {
    const schemasForKey = propertyMap.get(key)
    if (schemasForKey && schemasForKey.length > 0) {
      mergedProperties[key] = mergeSchemas(schemasForKey, options)
    }
  }

  const mergedSchema: SchemaObject = {
    type: 'object',
    properties: mergedProperties,
  }

  if (options.inferRequired !== false && requiredSets.length > 0) {
    const required = propertyOrder.filter((key) =>
      requiredSets.every((requiredSet) => requiredSet.has(key)),
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
  options: JsonSchemaGenerateOptions,
): SchemaObject {
  const itemSchemas = schemas.map((schema) => (schema.items as SchemaObject | undefined) ?? {})
  return {
    type: 'array',
    items: mergeSchemas(itemSchemas, options),
  }
}

function resolveSharedFormat(schemas: SchemaObject[]): string | undefined {
  const formats = schemas
    .map((schema) => (typeof schema.format === 'string' ? schema.format : ''))
    .filter(Boolean)
  if (formats.length === 0) {
    return undefined
  }

  const uniqueFormats = new Set(formats)
  return uniqueFormats.size === 1 ? formats[0] : undefined
}

function getSchemaType(schema: SchemaObject): string {
  return typeof schema.type === 'string' ? schema.type : ''
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
    return `[${value.map((entry) => stableStringify(entry)).join(',')}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    )
    return `{${entries
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/

function detectStringFormat(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  if (UUID_REGEX.test(trimmed)) {
    return 'uuid'
  }
  if (EMAIL_REGEX.test(trimmed)) {
    return 'email'
  }
  if (DATE_TIME_REGEX.test(trimmed)) {
    return 'date-time'
  }
  if (isUri(trimmed)) {
    return 'uri'
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
