import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'blake3-hash-text-or-file',
    path: '/tools/blake3-hash-text-or-file',
    component: () => import('./Blake3HashTextOrFileView.vue'),
  },
] as const
