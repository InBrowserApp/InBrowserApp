import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'time-zone-converter',
    path: '/tools/time-zone-converter',
    component: () => import('./TimeZoneConverterView.vue'),
  },
] as const
