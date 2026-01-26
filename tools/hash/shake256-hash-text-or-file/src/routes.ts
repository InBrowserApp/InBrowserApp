import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'shake256-hash-text-or-file',
    path: '/tools/shake256-hash-text-or-file',
    component: () => import('./SHAKE256HashTextOrFileView.vue'),
  },
] as const
