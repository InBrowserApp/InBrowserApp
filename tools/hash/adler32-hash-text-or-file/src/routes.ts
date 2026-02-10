import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'adler32-hash-text-or-file',
    path: '/tools/adler32-hash-text-or-file',
    component: () => import('./Adler32HashTextOrFileView.vue'),
  },
] as const
