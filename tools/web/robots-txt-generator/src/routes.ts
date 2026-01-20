import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'robots-txt-generator',
    path: '/tools/robots-txt-generator',
    component: () => import('./RobotsTxtGeneratorView.vue'),
  },
] as const
