import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-page-number-adder',
    path: '/tools/pdf-page-number-adder',
    component: () => import('./PDFPageNumberAdderView.vue'),
  },
] as const
