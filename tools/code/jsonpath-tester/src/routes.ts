import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'jsonpath-tester',
    path: '/tools/jsonpath-tester',
    component: () => import('./JsonPathTesterView.vue'),
  },
] as const
