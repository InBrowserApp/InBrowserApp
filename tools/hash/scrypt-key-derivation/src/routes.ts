import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'scrypt-key-derivation',
    path: '/tools/scrypt-key-derivation',
    component: () => import('./ScryptKeyDerivationView.vue'),
  },
] as const
