import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-splitter',
    path: '/tools/pdf-splitter',
    component: () => import('./PDFSplitterView.vue'),
  },
] as const
