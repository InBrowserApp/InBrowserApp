import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'port-number-lookup',
    path: '/tools/port-number-lookup',
    component: () => import('./PortNumberLookupView.vue'),
  },
] as const
