import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base85-decoder',
    path: '/tools/base85-decoder',
    component: () => import('./Base85DecoderView.vue'),
  },
] as const
