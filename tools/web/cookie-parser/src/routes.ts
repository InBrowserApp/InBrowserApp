import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'cookie-parser',
    path: '/tools/cookie-parser',
    component: () => import('./CookieParserView.vue'),
  },
] as const
