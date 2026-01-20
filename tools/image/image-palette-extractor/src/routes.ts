import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'image-palette-extractor',
    path: '/tools/image-palette-extractor',
    component: () => import('./ImagePaletteExtractorView.vue'),
  },
] as const
