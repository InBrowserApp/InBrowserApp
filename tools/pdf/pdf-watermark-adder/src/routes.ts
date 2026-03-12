import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-watermark-adder',
    path: '/tools/pdf-watermark-adder',
    component: () => import('./PDFWatermarkAdderView.vue'),
  },
] as const
