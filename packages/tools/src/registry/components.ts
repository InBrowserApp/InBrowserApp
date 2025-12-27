import type { ToolComponentProps } from '../types/tool'

// @ts-expect-error - Astro components lack type declarations
import RomanConverterIndex from '@tools/roman-numeral-converter'

/** Astro component type that accepts ToolComponentProps */
export type ToolAstroComponent = (props: ToolComponentProps) => Promise<Response>

/**
 * Registry of tool components
 * Maps tool ID to its Astro component
 */
export const componentMap: Record<string, ToolAstroComponent> = {
  'roman-numeral-converter': RomanConverterIndex,
}

/**
 * Get component by tool ID
 */
export function getToolComponent(toolId: string): ToolAstroComponent | undefined {
  return componentMap[toolId]
}
