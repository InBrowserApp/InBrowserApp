import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pgp-key-generator',
    path: '/tools/pgp-key-generator',
    component: () => import('./PgpKeyGeneratorView.vue'),
  },
] as const
