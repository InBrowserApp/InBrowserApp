import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'cron-expression-generator',
    path: '/tools/cron-expression-generator',
    component: () => import('./CronExpressionGeneratorView.vue'),
  },
] as const
