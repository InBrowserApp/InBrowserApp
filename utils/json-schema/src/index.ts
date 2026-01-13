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
