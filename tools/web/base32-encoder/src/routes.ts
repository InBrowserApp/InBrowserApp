import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base32-encoder',
    path: '/tools/base32-encoder',
    component: () => import('./Base32EncoderView.vue'),
  },
] as const
