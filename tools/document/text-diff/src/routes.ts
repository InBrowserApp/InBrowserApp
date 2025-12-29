import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'text-diff',
    path: '/tools/text-diff',
    component: () => import('./TextDiffView.vue'),
  },
] as const
