import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'cron-expression-parser',
    path: '/tools/cron-expression-parser',
    component: () => import('./CronExpressionParserView.vue'),
  },
] as const
