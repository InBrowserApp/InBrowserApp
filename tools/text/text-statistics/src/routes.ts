import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'text-statistics',
    path: '/tools/text-statistics',
    component: () => import('./TextStatisticsView.vue'),
  },
] as const
