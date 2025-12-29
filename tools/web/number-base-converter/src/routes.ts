import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'number-base-converter',
    path: '/tools/number-base-converter',
    component: () => import('./NumberBaseConverterView.vue'),
  },
] as const
