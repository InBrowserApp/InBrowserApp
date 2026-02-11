import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-merger',
    path: '/tools/pdf-merger',
    component: () => import('./PDFMergerView.vue'),
  },
] as const
