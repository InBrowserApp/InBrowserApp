import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base32-decoder',
    path: '/tools/base32-decoder',
    component: () => import('./Base32DecoderView.vue'),
  },
] as const
