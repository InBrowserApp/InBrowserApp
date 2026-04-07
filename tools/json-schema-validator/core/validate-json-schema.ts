import Ajv from "ajv"
import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"

type SchemaDraft = "draft-07" | "2020-12"

type ValidationIssue = Readonly<{
  path: string
  keyword: string
  message: string
}>

type ValidationResult =
  | Readonly<{
      state: "idle"
    }>
  | Readonly<{
      state: "parse-error"
      source: "schema" | "data"
      message: string
    }>
  | Readonly<{
      state: "schema-error"
      detectedDraft: SchemaDraft
      message: string
    }>
  | Readonly<{
      state: "validated"
      detectedDraft: SchemaDraft
      valid: boolean
      issues: readonly ValidationIssue[]
    }>

type ValidationOptions = Readonly<{
  allErrors: boolean
  validateFormats: boolean
}>

function detectSchemaDraft(schema: unknown): SchemaDraft {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return "2020-12"
  }

  const schemaUri = Reflect.get(schema, "$schema")

  if (typeof schemaUri === "string" && schemaUri.includes("draft-07")) {
    return "draft-07"
  }

  return "2020-12"
}

type ParseResult =
  | { kind: "empty" }
  | { kind: "ok"; value: unknown }
  | { kind: "error"; message: string }

function parseJson(source: string): ParseResult {
  if (source.trim() === "") {
    return { kind: "empty" }
  }

  try {
    return { kind: "ok", value: JSON.parse(source) }
  } catch (error) {
    return {
      kind: "error",
      /* v8 ignore next */
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

function createAjv(draft: SchemaDraft, options: ValidationOptions) {
  const ajv =
    draft === "draft-07"
      ? new Ajv({
          allErrors: options.allErrors,
          strict: false,
        })
      : new Ajv2020({
          allErrors: options.allErrors,
          strict: false,
        })

  if (options.validateFormats) {
    addFormats(ajv)
  }

  return ajv
}

function toIssuePath(
  instancePath: string,
  params: Record<string, unknown> | undefined
) {
  const missingProperty =
    params && typeof params.missingProperty === "string"
      ? `/${params.missingProperty}`
      : ""

  const base = instancePath || "/"
  return `${base}${missingProperty}`
}

function validateJsonSchemaText(
  schemaText: string,
  dataText: string,
  options: ValidationOptions
): ValidationResult {
  const parsedSchema = parseJson(schemaText)
  const parsedData = parseJson(dataText)

  if (parsedSchema.kind === "empty" || parsedData.kind === "empty") {
    return {
      state: "idle",
    }
  }

  if (parsedSchema.kind === "error") {
    return {
      state: "parse-error",
      source: "schema",
      message: parsedSchema.message,
    }
  }

  if (parsedData.kind === "error") {
    return {
      state: "parse-error",
      source: "data",
      message: parsedData.message,
    }
  }

  const detectedDraft = detectSchemaDraft(parsedSchema.value)
  const ajv = createAjv(detectedDraft, options)

  try {
    const validate = ajv.compile(parsedSchema.value as object)
    const valid = Boolean(validate(parsedData.value))
    const issues =
      validate.errors?.map((issue) => ({
        keyword: issue.keyword,
        /* v8 ignore next */
        message: issue.message ?? "Validation failed.",
        path: toIssuePath(
          issue.instancePath,
          issue.params as Record<string, unknown> | undefined
        ),
      })) ?? []

    return {
      state: "validated",
      detectedDraft,
      valid,
      issues,
    }
  } catch (error) {
    return {
      state: "schema-error",
      detectedDraft,
      /* v8 ignore next */
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

export { validateJsonSchemaText }
export type { ValidationOptions, ValidationResult }
