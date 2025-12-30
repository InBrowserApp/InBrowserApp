import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'morse-code-converter',
    path: '/tools/morse-code-converter',
    component: () => import('./MorseCodeConverterView.vue'),
  },
] as const
