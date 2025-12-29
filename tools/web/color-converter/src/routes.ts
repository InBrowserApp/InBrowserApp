import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'color-converter',
    path: '/tools/color-converter',
    component: () => import('./ColorConverterView.vue'),
  },
] as const
