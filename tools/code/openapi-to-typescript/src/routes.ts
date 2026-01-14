import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'openapi-to-typescript',
    path: '/tools/openapi-to-typescript',
    component: () => import('./OpenApiToTypescriptView.vue'),
  },
] as const
