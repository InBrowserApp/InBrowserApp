import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'jwk-pem-converter',
    path: '/tools/jwk-pem-converter',
    component: () => import('./JwkPemConverterView.vue'),
  },
] as const
