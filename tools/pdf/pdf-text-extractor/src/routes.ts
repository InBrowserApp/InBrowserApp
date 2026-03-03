import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-text-extractor',
    path: '/tools/pdf-text-extractor',
    component: () => import('./PDFTextExtractorView.vue'),
  },
] as const
