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

function parseJson(source: string) {
  if (source.trim() === "") {
    return {
      empty: true,
    } as const
  }

  try {
    return {
      empty: false,
      value: JSON.parse(source),
    } as const
  } catch (error) {
    return {
      empty: false,
      error: error instanceof Error ? error.message : String(error),
    } as const
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

  return `${instancePath || "/"}${missingProperty}` || "/"
}

function validateJsonSchemaText(
  schemaText: string,
  dataText: string,
  options: ValidationOptions
): ValidationResult {
  const parsedSchema = parseJson(schemaText)
  const parsedData = parseJson(dataText)

  if (parsedSchema.empty || parsedData.empty) {
    return {
      state: "idle",
    }
  }

  if ("error" in parsedSchema) {
    return {
      state: "parse-error",
      source: "schema",
      message: parsedSchema.error,
    }
  }

  if ("error" in parsedData) {
    return {
      state: "parse-error",
      source: "data",
      message: parsedData.error,
    }
  }

  const detectedDraft = detectSchemaDraft(parsedSchema.value)
  const ajv = createAjv(detectedDraft, options)

  try {
    const validate = ajv.compile(parsedSchema.value)
    const valid = Boolean(validate(parsedData.value))
    const issues =
      validate.errors?.map((issue) => ({
        keyword: issue.keyword,
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
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

export { validateJsonSchemaText }
export type {
  SchemaDraft,
  ValidationIssue,
  ValidationOptions,
  ValidationResult,
}
