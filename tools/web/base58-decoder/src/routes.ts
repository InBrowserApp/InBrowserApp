import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base58-decoder',
    path: '/tools/base58-decoder',
    component: () => import('./Base58DecoderView.vue'),
  },
] as const
