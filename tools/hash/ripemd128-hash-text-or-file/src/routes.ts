import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'ripemd128-hash-text-or-file',
    path: '/tools/ripemd128-hash-text-or-file',
    component: () => import('./RIPEMD128HashTextOrFileView.vue'),
  },
] as const
