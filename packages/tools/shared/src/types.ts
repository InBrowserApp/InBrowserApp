import type { SupportedLanguage } from './languages'

export type ToolI18n = Record<string, string> & { name: string; description: string }

export interface ToolMetadata {
  id: string
  path: string
  icon: string
  tags: readonly string[]
  features: readonly string[]
  i18n: Record<SupportedLanguage, ToolI18n>
}

/** Props returned by tool's getStaticPaths */
export interface ToolRouteProps {
  metadata: ToolMetadata
  component: () => Promise<{ default: unknown }>
}

/** Static path entry returned by tool's getStaticPaths */
export interface ToolStaticPath {
  params: { path: string }
  props: ToolRouteProps
}

/** Props passed to tool components */
export interface ToolComponentProps {
  i18n: ToolI18n
  lang: SupportedLanguage
}

/** Type for Astro component that accepts ToolComponentProps */
export type ToolComponent = (_props: ToolComponentProps) => unknown
