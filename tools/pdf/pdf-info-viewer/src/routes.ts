import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-info-viewer',
    path: '/tools/pdf-info-viewer',
    component: () => import('./PDFInfoViewerView.vue'),
  },
] as const
