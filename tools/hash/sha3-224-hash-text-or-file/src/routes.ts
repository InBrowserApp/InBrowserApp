import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sha3-224-hash-text-or-file',
    path: '/tools/sha3-224-hash-text-or-file',
    component: () => import('./SHA3_224HashTextOrFileView.vue'),
  },
] as const
