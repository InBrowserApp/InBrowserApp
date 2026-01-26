import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sm3-hash-text-or-file',
    path: '/tools/sm3-hash-text-or-file',
    component: () => import('./SM3HashTextOrFileView.vue'),
  },
] as const
