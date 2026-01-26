import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base85-encoder',
    path: '/tools/base85-encoder',
    component: () => import('./Base85EncoderView.vue'),
  },
] as const
