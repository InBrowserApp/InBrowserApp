import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'timer',
    path: '/tools/timer',
    component: () => import('./TimerView.vue'),
  },
] as const
