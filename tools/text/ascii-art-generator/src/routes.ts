import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'ascii-art-generator',
    path: '/tools/ascii-art-generator',
    component: () => import('./AsciiArtGeneratorView.vue'),
  },
] as const
