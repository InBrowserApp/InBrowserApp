import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sha3-256-hash-text-or-file',
    path: '/tools/sha3-256-hash-text-or-file',
    component: () => import('./SHA3_256HashTextOrFileView.vue'),
  },
] as const
