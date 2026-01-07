import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'exif-viewer',
    path: '/tools/exif-viewer',
    component: () => import('./ExifViewerView.vue'),
  },
] as const
