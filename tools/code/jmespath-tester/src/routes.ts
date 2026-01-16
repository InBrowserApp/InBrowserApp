import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'jmespath-tester',
    path: '/tools/jmespath-tester',
    component: () => import('./JmesPathTesterView.vue'),
  },
] as const
