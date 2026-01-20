import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'curl-converter',
    path: '/tools/curl-converter',
    component: () => import('./CurlConverterView.vue'),
  },
]

export default routes
