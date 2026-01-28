import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'md4-hash-text-or-file',
    path: '/tools/md4-hash-text-or-file',
    component: () => import('./MD4HashTextOrFileView.vue'),
  },
] as const
