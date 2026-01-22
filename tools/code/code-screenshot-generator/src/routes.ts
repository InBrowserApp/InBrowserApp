import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'code-screenshot-generator',
    path: '/tools/code-screenshot-generator',
    component: () => import('./CodeScreenshotGeneratorView.vue'),
  },
] as const
