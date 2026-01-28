import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'siphash-2-4-hash-text-or-file',
    path: '/tools/siphash-2-4-hash-text-or-file',
    component: () => import('./SipHash2_4HashTextOrFileView.vue'),
  },
] as const
