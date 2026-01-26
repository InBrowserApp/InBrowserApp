import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'shake128-hash-text-or-file',
    path: '/tools/shake128-hash-text-or-file',
    component: () => import('./SHAKE128HashTextOrFileView.vue'),
  },
] as const
