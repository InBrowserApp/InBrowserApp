import type { ToolMetadata, ToolRoute } from '../types/tool'

// Import tool metadata
import { metadata as romanConverterMeta } from '@tools/roman-numeral-converter/meta'

export const toolRegistry: ToolMetadata[] = [
  romanConverterMeta,
]

export async function getToolRoutes(): Promise<ToolRoute[]> {
  return toolRegistry.map(tool => ({
    id: tool.id,
    tool,
  }))
}
