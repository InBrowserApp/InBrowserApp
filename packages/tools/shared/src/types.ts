import type { SupportedLanguage } from './languages'

export interface ToolMeta {
  readonly ui: Record<string, string> & { name: string; description: string }
}

export interface ToolMetadata {
  id: string
  tags: readonly string[]
  features: readonly string[]
  meta: Record<SupportedLanguage, ToolMeta>
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
  ui: Record<string, string> & { name: string; description: string }
  lang: SupportedLanguage
}

/** Type for Astro component that accepts ToolComponentProps */
export type ToolComponent = (_props: ToolComponentProps) => unknown
