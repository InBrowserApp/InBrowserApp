import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'whirlpool-hash-text-or-file',
    path: '/tools/whirlpool-hash-text-or-file',
    component: () => import('./WhirlpoolHashTextOrFileView.vue'),
  },
] as const
