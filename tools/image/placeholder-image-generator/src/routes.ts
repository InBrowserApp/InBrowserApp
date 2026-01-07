import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'placeholder-image-generator',
    path: '/tools/placeholder-image-generator',
    component: () => import('./PlaceholderImageGeneratorView.vue'),
  },
] as const
