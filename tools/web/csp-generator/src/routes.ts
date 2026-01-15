import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'csp-generator',
    path: '/tools/csp-generator',
    component: () => import('./CspGeneratorView.vue'),
  },
] as const
