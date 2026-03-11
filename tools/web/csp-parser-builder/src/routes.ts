import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'csp-parser-builder',
    path: '/tools/csp-parser-builder',
    component: () => import('./CSPParserBuilderView.vue'),
  },
] as const
