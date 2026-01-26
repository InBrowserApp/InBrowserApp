import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sha3-512-hash-text-or-file',
    path: '/tools/sha3-512-hash-text-or-file',
    component: () => import('./SHA3_512HashTextOrFileView.vue'),
  },
] as const
