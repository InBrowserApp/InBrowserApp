import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sql-formatter-and-linter',
    path: '/tools/sql-formatter-and-linter',
    component: () => import('./SqlFormatterAndLinterView.vue'),
  },
] as const
