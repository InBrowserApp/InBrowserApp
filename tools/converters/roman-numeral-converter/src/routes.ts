import type { ToolStaticPath } from '@inbrowserapp/tools-shared'
import { metadata } from './meta'

export function getStaticPaths(): ToolStaticPath[] {
  return [
    {
      params: { path: 'roman-numeral-converter' },
      props: {
        metadata,
        component: () => import('./index.astro'),
      },
    },
  ]
}
