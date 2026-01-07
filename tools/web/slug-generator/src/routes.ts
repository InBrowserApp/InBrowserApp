import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'slug-generator',
    path: '/tools/slug-generator',
    component: () => import('./SlugGeneratorView.vue'),
  },
] as const
