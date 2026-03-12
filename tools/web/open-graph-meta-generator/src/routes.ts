import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'open-graph-meta-generator',
    path: '/tools/open-graph-meta-generator',
    component: () => import('./OpenGraphMetaGeneratorView.vue'),
  },
] as const
