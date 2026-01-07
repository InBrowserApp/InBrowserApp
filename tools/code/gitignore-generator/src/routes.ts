import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'gitignore-generator',
    path: '/tools/code/gitignore-generator',
    component: () => import('./GitignoreGeneratorView.vue'),
  },
] as const
