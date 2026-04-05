import type {
  ToolDefinition,
  ToolMessageCatalogs,
  ToolValidationOptions,
} from "./types"
import { ToolContractError } from "./errors"
import { DEFAULT_REQUIRED_TOOL_LANGUAGES, uniqueLanguages } from "./languages"
import { toolDefinitionSchema, toolMessageCatalogSchema } from "./schema"

function formatPath(path: readonly PropertyKey[]) {
  return path.length === 0 ? "(root)" : path.map(String).join(".")
}

function resolveRequiredLanguages<TLanguage extends string>(
  options?: ToolValidationOptions<TLanguage>
) {
  const requiredLanguages =
    options?.requiredLanguages ?? DEFAULT_REQUIRED_TOOL_LANGUAGES

  return uniqueLanguages(requiredLanguages)
}

function getMissingLanguages(
  entries: Record<string, unknown> | undefined,
  requiredLanguages: readonly string[]
) {
  if (!entries) {
    return [...requiredLanguages]
  }

  return requiredLanguages.filter((language) => !(language in entries))
}

function validateToolDefinition<TDefinition extends ToolDefinition>(
  definition: TDefinition,
  options?: ToolValidationOptions
) {
  const issues: string[] = []
  const parsedDefinition = toolDefinitionSchema.safeParse(definition)

  if (!parsedDefinition.success) {
    issues.push(
      ...parsedDefinition.error.issues.map(
        (issue) => `${formatPath(issue.path)}: ${issue.message}`
      )
    )
  }

  const requiredLanguages = resolveRequiredLanguages(options)

  const missingMessageLanguages = getMissingLanguages(
    definition.messages as Record<string, unknown> | undefined,
    requiredLanguages
  )

  if (missingMessageLanguages.length > 0) {
    issues.push(
      `messages: missing required languages ${missingMessageLanguages.join(", ")}`
    )
  }

  if (definition.content) {
    const missingContentLanguages = getMissingLanguages(
      definition.content as Record<string, unknown>,
      requiredLanguages
    )

    if (missingContentLanguages.length > 0) {
      issues.push(
        `content: missing required languages ${missingContentLanguages.join(", ")}`
      )
    }
  }

  return {
    issues,
    valid: issues.length === 0,
  }
}

function assertToolDefinition<TDefinition extends ToolDefinition>(
  definition: TDefinition,
  options?: ToolValidationOptions
) {
  const result = validateToolDefinition(definition, options)

  if (!result.valid) {
    throw new ToolContractError("Invalid tool definition.", result.issues)
  }
}

const validateToolManifest = validateToolDefinition
const assertToolManifest = assertToolDefinition

function validateToolMessageCatalogs<TCatalogs extends ToolMessageCatalogs>(
  catalogs: TCatalogs,
  options?: ToolValidationOptions
) {
  const issues: string[] = []
  const requiredLanguages = resolveRequiredLanguages(options)

  for (const [language, catalog] of Object.entries(catalogs)) {
    const parsedCatalog = toolMessageCatalogSchema.safeParse(catalog)

    if (!parsedCatalog.success) {
      issues.push(
        ...parsedCatalog.error.issues.map(
          (issue) => `${language}.${formatPath(issue.path)}: ${issue.message}`
        )
      )
    }
  }

  const missingLanguages = getMissingLanguages(
    catalogs as Record<string, unknown>,
    requiredLanguages
  )

  if (missingLanguages.length > 0) {
    issues.push(
      `messages: missing required languages ${missingLanguages.join(", ")}`
    )
  }

  return {
    issues,
    valid: issues.length === 0,
  }
}

function assertToolMessageCatalogs<TCatalogs extends ToolMessageCatalogs>(
  catalogs: TCatalogs,
  options?: ToolValidationOptions
) {
  const result = validateToolMessageCatalogs(catalogs, options)

  if (!result.valid) {
    throw new ToolContractError("Invalid tool message catalogs.", result.issues)
  }
}

export {
  assertToolDefinition,
  assertToolManifest,
  assertToolMessageCatalogs,
  resolveRequiredLanguages,
  validateToolDefinition,
  validateToolManifest,
  validateToolMessageCatalogs,
}
