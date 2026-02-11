import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'argon2-hash-password',
    path: '/tools/argon2-hash-password',
    component: () => import('./Argon2HashPasswordView.vue'),
  },
] as const
