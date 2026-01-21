import type { ToolStaticPath } from '@shared/tools'
import { metadata } from './meta'

export function getStaticPaths(): ToolStaticPath[] {
  return [
    {
      params: { path: 'roman-numeral-converter' },
      props: {
        metadata,
        component: () => import('./view/index.astro'),
      },
    },
  ]
}
