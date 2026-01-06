import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'http-status-code-lookup',
    path: '/tools/http-status-code-lookup',
    component: () => import('./HttpStatusCodeLookupView.vue'),
  },
] as const
