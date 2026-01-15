import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'ical-event-generator',
    path: '/tools/ical-event-generator',
    component: () => import('./IcalEventGeneratorView.vue'),
  },
] as const
