import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'merge-pdf',
    path: '/tools/merge-pdf',
    component: () => import('./MergePDFView.vue'),
  },
] as const
