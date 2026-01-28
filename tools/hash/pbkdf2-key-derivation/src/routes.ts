import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pbkdf2-key-derivation',
    path: '/tools/pbkdf2-key-derivation',
    component: () => import('./Pbkdf2KeyDerivationView.vue'),
  },
] as const
