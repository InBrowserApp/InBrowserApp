import type { ToolManifest } from "@workspace/tool-sdk"

export const toolRegistry = [] as const satisfies readonly ToolManifest[]

export const toolRegistryBySlug = {} as const satisfies Record<
  string,
  ToolManifest
>

export const toolRegistryById = {} as const satisfies Record<
  string,
  ToolManifest
>
