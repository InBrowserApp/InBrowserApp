import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'json-diff-path',
    path: '/tools/json-diff-path',
    component: () => import('./JsonDiffPathView.vue'),
  },
] as const
