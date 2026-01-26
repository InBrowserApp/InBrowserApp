import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'ripemd320-hash-text-or-file',
    path: '/tools/ripemd320-hash-text-or-file',
    component: () => import('./RIPEMD320HashTextOrFileView.vue'),
  },
] as const
