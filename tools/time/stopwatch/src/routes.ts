import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'stopwatch',
    path: '/tools/stopwatch',
    component: () => import('./StopwatchView.vue'),
  },
] as const
