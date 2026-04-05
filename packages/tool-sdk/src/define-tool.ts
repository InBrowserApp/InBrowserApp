import type { ToolManifest, ToolValidationOptions } from "./types"
import { assertToolDefinition } from "./validate"

function defineTool<const TManifest extends ToolManifest>(
  definition: TManifest,
  options?: ToolValidationOptions
) {
  assertToolDefinition(definition, options)

  return definition
}

export { defineTool }
