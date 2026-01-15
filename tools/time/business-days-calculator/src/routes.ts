import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'business-days-calculator',
    path: '/tools/business-days-calculator',
    component: () => import('./BusinessDaysCalculatorView.vue'),
  },
]
