import type { DefaultRequiredToolLanguage, ToolLanguage } from "./languages"

type ToolMeta = Readonly<{
  name: string
  description: string
}>

type ToolMetaCatalogs<TLanguage extends string = ToolLanguage> = Readonly<
  Record<TLanguage, ToolMeta>
>

type ToolDefinition = Readonly<{
  category: string
  icon: string
  tags?: readonly string[]
}>

type ToolManifest = ToolDefinition

type ToolValidationOptions<TLanguage extends string = ToolLanguage> = Readonly<{
  requiredLanguages?: readonly TLanguage[]
}>

export type {
  DefaultRequiredToolLanguage,
  ToolDefinition,
  ToolLanguage,
  ToolManifest,
  ToolMeta,
  ToolMetaCatalogs,
  ToolValidationOptions,
}
