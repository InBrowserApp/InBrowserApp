import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-compressor',
    path: '/tools/pdf-compressor',
    component: () => import('./PDFCompressorView.vue'),
  },
] as const
