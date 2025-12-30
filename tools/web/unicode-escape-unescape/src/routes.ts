import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'unicode-escape-unescape',
    path: '/tools/unicode-escape-unescape',
    component: () => import('./UnicodeEscapeUnescapeView.vue'),
  },
] as const
