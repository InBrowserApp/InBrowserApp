import { toolRegistryBySlug } from "@workspace/tool-registry"

import type { AstroComponentFactory } from "astro/runtime/server/index.js"
import type { ToolMeta } from "@workspace/tool-sdk"
import type { ToolRegistryEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "./site"

import {
  DEFAULT_SITE_LANGUAGE,
  isSupportedSiteLanguage,
  resolveLocalizedAssetLanguage,
} from "./site"

type ToolPageModule = {
  default: AstroComponentFactory
}

type LoadedToolPageData = Readonly<{
  availableLanguages: readonly SiteLanguage[]
  meta: ToolMeta
  metaLanguage: string
  Page: AstroComponentFactory | null
  tool: ToolRegistryEntry
}>

const toolPageModules = import.meta.glob("@tools/*/index.astro")

function getToolBySlug(slug: string) {
  const toolRegistry = toolRegistryBySlug as Record<string, ToolRegistryEntry>

  return slug in toolRegistry ? toolRegistry[slug] : null
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

async function loadToolPage(slug: string) {
  const importer = toolPageModules[`@tools/${slug}/index.astro`]

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

  const { language: metaLanguage, meta } = loadToolMeta(tool, language)
  const Page = await loadToolPage(slug)

  return {
    availableLanguages: getAvailableToolLanguages(tool.locales),
    meta,
    metaLanguage,
    Page,
    tool,
  }
}

export { getToolBySlug, loadToolPageData }
export type { LoadedToolPageData }
