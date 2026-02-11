import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'argon2-hash-password-verifier',
    path: '/tools/argon2-hash-password-verifier',
    component: () => import('./Argon2HashPasswordVerifierView.vue'),
  },
] as const
