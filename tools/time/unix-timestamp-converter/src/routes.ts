import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'unix-timestamp-converter',
    path: '/tools/unix-timestamp-converter',
    component: () => import('./UnixTimestampConverterView.vue'),
  },
] as const
