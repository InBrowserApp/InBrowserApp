import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'list-comparer',
    path: '/tools/list-comparer',
    component: () => import('./ListComparerView.vue'),
  },
] as const
