import type { DefaultRequiredToolLanguage, ToolLanguage } from "./languages"

type RelativeToolPath = `./${string}`
type ToolAstroFilePath = `./${string}.astro`
type ToolMessageFilePath = `./${string}.json`
type ToolContentFilePath = `./${string}.mdx`
type ToolModuleFilePath = `./${string}.${"js" | "jsx" | "ts" | "tsx"}`

type ToolMessageMeta = Readonly<{
  name: string
  description: string
}>

type ToolMessageCatalog = Readonly<
  {
    meta: ToolMessageMeta
  } & Record<string, unknown>
>

type ToolLocalizedMessageFiles<TLanguage extends string = ToolLanguage> =
  Readonly<Record<TLanguage, ToolMessageFilePath>>

type ToolLocalizedContentFiles<TLanguage extends string = ToolLanguage> =
  Readonly<Record<TLanguage, ToolContentFilePath>>

type ToolMessageCatalogs<TLanguage extends string = ToolLanguage> = Readonly<
  Record<TLanguage, ToolMessageCatalog>
>

type ToolIslandDefinition = Readonly<{
  path: ToolModuleFilePath
  exportName?: string
}>

type ToolDefinition<
  TMessages extends ToolLocalizedMessageFiles =
    ToolLocalizedMessageFiles<DefaultRequiredToolLanguage>,
  TContent extends ToolLocalizedContentFiles | undefined =
    | ToolLocalizedContentFiles<DefaultRequiredToolLanguage>
    | undefined,
> = Readonly<{
  id: string
  slug: string
  category: string
  group?: string
  icon: string
  tags: readonly string[]
  searchTerms?: readonly string[]
  features?: readonly string[]
  messages: TMessages
  content?: TContent
  page?: ToolAstroFilePath
  island?: ToolIslandDefinition
}>

type ToolManifest<
  TMessages extends ToolLocalizedMessageFiles =
    ToolLocalizedMessageFiles<DefaultRequiredToolLanguage>,
  TContent extends ToolLocalizedContentFiles | undefined =
    | ToolLocalizedContentFiles<DefaultRequiredToolLanguage>
    | undefined,
> = ToolDefinition<TMessages, TContent>

type ToolValidationOptions<TLanguage extends string = ToolLanguage> = Readonly<{
  requiredLanguages?: readonly TLanguage[]
}>

type CreateLocalizedAssetFilesOptions = Readonly<{
  directory: string
}>

export type {
  CreateLocalizedAssetFilesOptions,
  DefaultRequiredToolLanguage,
  RelativeToolPath,
  ToolAstroFilePath,
  ToolContentFilePath,
  ToolDefinition,
  ToolIslandDefinition,
  ToolLanguage,
  ToolManifest,
  ToolLocalizedContentFiles,
  ToolLocalizedMessageFiles,
  ToolMessageCatalog,
  ToolMessageCatalogs,
  ToolMessageFilePath,
  ToolMessageMeta,
  ToolModuleFilePath,
  ToolValidationOptions,
}
