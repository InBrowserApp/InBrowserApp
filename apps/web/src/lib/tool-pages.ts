import {
  toolPageLoaders,
  toolRegistry,
  toolRegistryBySlug,
} from "@workspace/tool-registry"

import {
  DEFAULT_SITE_LANGUAGE,
  isSupportedSiteLanguage,
  resolveLocalizedAssetLanguage,
} from "./site"

import type { AstroComponentFactory } from "astro/runtime/server/index.js"
import type { ToolMeta } from "@workspace/tool-sdk"
import type { ToolRegistryEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "./site"

type LoadedToolPageData = Readonly<{
  availableLanguages: readonly SiteLanguage[]
  meta: ToolMeta
  metaLanguage: string
  Page: AstroComponentFactory | null
  relatedTools: readonly ToolPageRelatedTool[]
  tool: ToolRegistryEntry
}>

type ToolPageRelatedTool = Readonly<{
  slug: string
  category: string
  icon: string
  tags: readonly string[]
  meta: ToolMeta
}>

function getToolBySlug(slug: string) {
  const registry = toolRegistryBySlug as Record<string, ToolRegistryEntry>
  return slug in registry ? registry[slug] : null
}

function getAvailableToolLanguages(locales: Record<string, ToolMeta>) {
  return Object.keys(locales)
    .filter(isSupportedSiteLanguage)
    .sort((left, right) => left.localeCompare(right))
}

function loadToolMeta(tool: ToolRegistryEntry, language: SiteLanguage) {
  const availableLanguages = Object.keys(tool.locales).sort((left, right) =>
    left.localeCompare(right)
  )
  const resolvedLanguage = resolveLocalizedAssetLanguage(
    language,
    availableLanguages,
    DEFAULT_SITE_LANGUAGE
  )
  const meta =
    tool.locales[resolvedLanguage] ??
    tool.locales[DEFAULT_SITE_LANGUAGE] ??
    Object.values(tool.locales)[0]

  if (!meta) {
    throw new Error(`Missing localized tool meta for ${tool.slug}.`)
  }

  return {
    language: resolvedLanguage,
    meta,
  }
}

function getRelatedTools(tool: ToolRegistryEntry, language: SiteLanguage) {
  return toolRegistry
    .filter(
      (candidate) =>
        candidate.category === tool.category && candidate.slug !== tool.slug
    )
    .map((candidate) => ({
      category: candidate.category,
      icon: candidate.icon,
      meta: loadToolMeta(candidate, language).meta,
      slug: candidate.slug,
      tags: candidate.tags,
    }))
    .sort((left, right) =>
      left.meta.name.localeCompare(right.meta.name, language)
    )
}

async function loadToolPage(slug: string) {
  const loader = toolPageLoaders[slug]

  if (!loader) {
    return null
  }

  const loadedModule = await loader()

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

  const { language: metaLanguage, meta } = loadToolMeta(tool, language)
  const Page = await loadToolPage(slug)

  return {
    availableLanguages: getAvailableToolLanguages(tool.locales),
    meta,
    metaLanguage,
    Page,
    relatedTools: getRelatedTools(tool, language),
    tool,
  }
}

export { loadToolPageData }
