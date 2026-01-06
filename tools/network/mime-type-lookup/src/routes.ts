import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'mime-type-lookup',
    path: '/tools/mime-type-lookup',
    component: () => import('./MimeTypeLookupView.vue'),
  },
] as const
