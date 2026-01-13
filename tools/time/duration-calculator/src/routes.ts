import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'duration-calculator',
    path: '/tools/duration-calculator',
    component: () => import('./DurationCalculatorView.vue'),
  },
] as const
