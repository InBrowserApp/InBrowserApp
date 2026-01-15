import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'image-metadata-cleaner',
    path: '/tools/image-metadata-cleaner',
    component: () => import('./ImageMetadataCleanerView.vue'),
  },
] as const
