import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sha512-256-hash-text-or-file',
    path: '/tools/sha512-256-hash-text-or-file',
    component: () => import('./SHA512_256HashTextOrFileView.vue'),
  },
] as const
