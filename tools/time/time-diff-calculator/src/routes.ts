import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'time-diff-calculator',
    path: '/tools/time-diff-calculator',
    component: () => import('./TimeDiffCalculatorView.vue'),
  },
] as const
