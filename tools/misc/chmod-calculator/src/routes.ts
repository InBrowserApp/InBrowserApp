import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'chmod-calculator',
    path: '/tools/chmod-calculator',
    component: () => import('./ChmodCalculatorView.vue'),
  },
] as const
