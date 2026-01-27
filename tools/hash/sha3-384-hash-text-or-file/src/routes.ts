import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sha3-384-hash-text-or-file',
    path: '/tools/sha3-384-hash-text-or-file',
    component: () => import('./SHA3_384HashTextOrFileView.vue'),
  },
] as const
