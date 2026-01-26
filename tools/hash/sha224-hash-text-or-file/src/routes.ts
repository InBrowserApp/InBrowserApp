import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sha224-hash-text-or-file',
    path: '/tools/sha224-hash-text-or-file',
    component: () => import('./SHA224HashTextOrFileView.vue'),
  },
] as const
