import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'image-to-ico',
    path: '/tools/image-to-ico',
    component: () => import('./ImageToIcoConverterView.vue'),
  },
] as const
