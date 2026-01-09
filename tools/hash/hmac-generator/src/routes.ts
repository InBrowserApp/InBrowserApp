import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'hmac-generator',
    path: '/tools/hmac-generator',
    component: () => import('./HmacGeneratorView.vue'),
  },
] as const
