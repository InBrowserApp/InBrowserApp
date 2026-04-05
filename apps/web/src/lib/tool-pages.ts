import { toolRegistryBySlug } from "@workspace/tool-registry"

import type { AstroComponentFactory } from "astro/runtime/server/index.js"
import type { ComponentType } from "react"
import type { ToolManifest, ToolMessageCatalog } from "@workspace/tool-sdk"
import type { SiteLanguage } from "./site"

import {
  DEFAULT_SITE_LANGUAGE,
  isSupportedSiteLanguage,
  resolveLocalizedAssetLanguage,
} from "./site"

type LocalizedContentModule = {
  default: AstroComponentFactory
}

type ToolPageModule = {
  default: AstroComponentFactory
}

type LoadedToolPageData = Readonly<{
  tool: ToolManifest
  messages: ToolMessageCatalog
  messageLanguage: string
  contentLanguage: string | null
  Content: AstroComponentFactory | null
  Page: AstroComponentFactory | null
  Island: ComponentType<Record<string, unknown>> | null
  availableLanguages: readonly SiteLanguage[]
}>

const toolMessageModules = import.meta.glob("../../../../tools/*/**/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ToolMessageCatalog>
const toolPageModules = import.meta.glob("../../../../tools/*/**/*.astro")
const toolContentModules = import.meta.glob("../../../../tools/*/**/*.mdx")
const toolIslandModules = import.meta.glob(
  "../../../../tools/*/**/*.{js,jsx,ts,tsx}"
)

function stripRelativePrefix(path: string) {
  return path.startsWith("./") ? path.slice(2) : path
}

function toToolModuleKey(slug: string, relativePath: string) {
  return `../../../../tools/${slug}/${stripRelativePrefix(relativePath)}`
}

function getToolBySlug(slug: string) {
  const toolRegistry = toolRegistryBySlug as Record<string, ToolManifest>

  return slug in toolRegistry ? toolRegistry[slug] : null
}

function getAvailableToolLanguages(record: Record<string, string> | undefined) {
  return record
    ? Object.keys(record)
        .filter(isSupportedSiteLanguage)
        .sort((left, right) => left.localeCompare(right))
    : []
}

function loadToolMessages(tool: ToolManifest, language: SiteLanguage) {
  const messageFiles = tool.messages as Readonly<Record<string, string>>
  const availableLanguages = Object.keys(messageFiles).sort((left, right) =>
    left.localeCompare(right)
  )
  const resolvedLanguage = resolveLocalizedAssetLanguage(
    language,
    availableLanguages,
    DEFAULT_SITE_LANGUAGE
  )
  const relativePath = messageFiles[resolvedLanguage]

  if (!relativePath) {
    throw new Error(
      `Missing tool message file path for ${tool.slug}:${resolvedLanguage}.`
    )
  }

  const catalog = toolMessageModules[toToolModuleKey(tool.slug, relativePath)]

  if (!catalog) {
    throw new Error(
      `Missing generated tool message catalog for ${tool.slug}:${resolvedLanguage}.`
    )
  }

  return {
    catalog,
    language: resolvedLanguage,
  }
}

async function loadToolContent(tool: ToolManifest, language: SiteLanguage) {
  if (!tool.content) {
    return {
      Content: null as AstroComponentFactory | null,
      language: null,
    }
  }

  const contentFiles = tool.content as Readonly<Record<string, string>>
  const availableLanguages = Object.keys(contentFiles).sort((left, right) =>
    left.localeCompare(right)
  )
  const resolvedLanguage = resolveLocalizedAssetLanguage(
    language,
    availableLanguages,
    DEFAULT_SITE_LANGUAGE
  )
  const relativePath = contentFiles[resolvedLanguage]

  if (!relativePath) {
    return {
      Content: null,
      language: resolvedLanguage,
    }
  }

  const importer = toolContentModules[toToolModuleKey(tool.slug, relativePath)]

  if (!importer) {
    return {
      Content: null,
      language: resolvedLanguage,
    }
  }

  const loadedModule = (await importer()) as LocalizedContentModule

  return {
    Content: loadedModule.default,
    language: resolvedLanguage,
  }
}

async function loadToolIsland(tool: ToolManifest) {
  if (!tool.island) {
    return null
  }

  const importer =
    toolIslandModules[toToolModuleKey(tool.slug, tool.island.path)]

  if (!importer) {
    return null
  }

  const loadedModule = (await importer()) as Record<string, unknown>

  return (loadedModule[tool.island.exportName ?? "default"] ??
    null) as ComponentType<Record<string, unknown>> | null
}

async function loadToolPage(tool: ToolManifest) {
  if (!tool.page) {
    return null
  }

  const importer = toolPageModules[toToolModuleKey(tool.slug, tool.page)]

  if (!importer) {
    return null
  }

  const loadedModule = (await importer()) as ToolPageModule

  return loadedModule.default
}

async function loadToolPageData(
  slug: string,
  language: SiteLanguage
): Promise<LoadedToolPageData | null> {
  const tool = getToolBySlug(slug)

  if (!tool) {
    return null
  }

  const { catalog, language: messageLanguage } = loadToolMessages(
    tool,
    language
  )
  const { Content, language: contentLanguage } = await loadToolContent(
    tool,
    language
  )
  const Page = await loadToolPage(tool)
  const Island = await loadToolIsland(tool)

  return {
    Content,
    Page,
    Island,
    availableLanguages: getAvailableToolLanguages(tool.messages),
    contentLanguage,
    messageLanguage,
    messages: catalog,
    tool,
  }
}

export { getToolBySlug, loadToolPageData }
export type { LoadedToolPageData }
