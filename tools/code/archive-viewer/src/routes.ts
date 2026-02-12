import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'archive-viewer',
    path: '/tools/archive-viewer',
    component: () => import('./ArchiveViewerView.vue'),
  },
] as const
