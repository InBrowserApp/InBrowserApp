import type { ToolStaticPath } from '@inbrowserapp/tools-shared'

export async function getToolStaticPaths(): Promise<ToolStaticPath[]> {
  const tools = await Promise.all([import('@tools/roman-numeral-converter/routes')])
  return tools.flatMap((t) => t.getStaticPaths())
}
