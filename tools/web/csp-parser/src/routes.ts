import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'csp-parser',
    path: '/tools/csp-parser',
    component: () => import('./CspParserView.vue'),
  },
] as const
