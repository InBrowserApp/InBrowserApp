import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'case-converter',
    path: '/tools/case-converter',
    component: () => import('./CaseConverterView.vue'),
  },
] as const
