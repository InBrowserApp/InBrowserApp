import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'csp-generator-parser',
    path: '/tools/csp-generator-parser',
    component: () => import('./CspGeneratorParserView.vue'),
  },
] as const
