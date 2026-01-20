import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base16-encoder',
    path: '/tools/base16-encoder',
    component: () => import('./Base16EncoderView.vue'),
  },
] as const
