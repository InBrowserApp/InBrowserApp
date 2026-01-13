import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'prettier-code-formatter',
    path: '/tools/prettier-code-formatter',
    component: () => import('./PrettierCodeFormatterView.vue'),
  },
] as const
