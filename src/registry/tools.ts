import type { ToolMetadata, ToolRoute } from '@/types/tool'

// TODO: Import tool metadata here
// import { metadata as jsonFormatterMeta } from '@/tools/code/json-formatter/meta'

export const toolRegistry: ToolMetadata[] = [
  // TODO: Add tools here
  // jsonFormatterMeta,
]

export async function getToolRoutes(): Promise<ToolRoute[]> {
  return toolRegistry.map(tool => ({
    id: tool.id,
    tool,
  }))
}
