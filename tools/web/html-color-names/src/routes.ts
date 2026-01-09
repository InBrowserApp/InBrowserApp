import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'html-color-names',
    path: '/tools/html-color-names',
    component: () => import('./HtmlColorNamesView.vue'),
  },
] as const
