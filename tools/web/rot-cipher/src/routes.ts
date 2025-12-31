import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'rot-cipher',
    path: '/tools/rot-cipher',
    component: () => import('./RotCipherView.vue'),
  },
] as const
