import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-metadata-editor',
    path: '/tools/pdf-metadata-editor',
    component: () => import('./PDFMetadataEditorView.vue'),
  },
] as const
