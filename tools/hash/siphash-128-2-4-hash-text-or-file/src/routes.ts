import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'siphash-128-2-4-hash-text-or-file',
    path: '/tools/siphash-128-2-4-hash-text-or-file',
    component: () => import('./SipHash128_2_4HashTextOrFileView.vue'),
  },
] as const
