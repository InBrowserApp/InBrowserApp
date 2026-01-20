import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'curl-fetch-converter',
    path: '/tools/curl-fetch-converter',
    component: () => import('./CurlFetchConverterView.vue'),
  },
]

export default routes
