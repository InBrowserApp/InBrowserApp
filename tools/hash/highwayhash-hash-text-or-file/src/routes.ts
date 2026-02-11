import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'highwayhash-hash-text-or-file',
    path: '/tools/highwayhash-hash-text-or-file',
    component: () => import('./HighwayHashTextOrFileView.vue'),
  },
] as const
