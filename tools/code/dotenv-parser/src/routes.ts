import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'dotenv-parser',
    path: '/tools/dotenv-parser',
    component: () => import('./DotenvParserView.vue'),
  },
] as const
