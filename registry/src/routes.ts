import type { ToolStaticPath } from '@shared/tools'

export async function getToolStaticPaths(): Promise<ToolStaticPath[]> {
  const tools = await Promise.all([import('@tools/roman-numeral-converter/routes')])
  return tools.flatMap((t) => t.getStaticPaths())
}
