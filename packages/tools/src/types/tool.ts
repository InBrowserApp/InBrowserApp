import type { SupportedLanguage } from '../i18n/languages'

export interface ToolMeta {
  name: string
  description: string
  ui: Record<string, string>
}

export interface ToolMetadata {
  id: string
  domain: string
  path: string
  tags: readonly string[]
  features: readonly string[]
  subPaths?: readonly string[]
  meta: Record<SupportedLanguage, ToolMeta>
}

export interface ToolRoute {
  id: string
  tool: ToolMetadata
}

/** Props passed to tool components */
export interface ToolComponentProps {
  name: string
  description: string
  ui: Record<string, string>
}

/** Type for Astro component that accepts ToolComponentProps */
export type ToolComponent = (_props: ToolComponentProps) => unknown
