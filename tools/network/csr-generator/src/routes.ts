import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'csr-generator',
    path: '/tools/csr-generator',
    component: () => import('./CsrGeneratorView.vue'),
  },
] as const
