import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'ripemd256-hash-text-or-file',
    path: '/tools/ripemd256-hash-text-or-file',
    component: () => import('./RIPEMD256HashTextOrFileView.vue'),
  },
] as const
