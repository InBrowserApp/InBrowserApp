import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sha512-224-hash-text-or-file',
    path: '/tools/sha512-224-hash-text-or-file',
    component: () => import('./SHA512_224HashTextOrFileView.vue'),
  },
] as const
