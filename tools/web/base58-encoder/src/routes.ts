import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base58-encoder',
    path: '/tools/base58-encoder',
    component: () => import('./Base58EncoderView.vue'),
  },
] as const
