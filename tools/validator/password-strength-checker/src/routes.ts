import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'password-strength-checker',
    path: '/tools/password-strength-checker',
    component: () => import('./PasswordStrengthCheckerView.vue'),
  },
] as const
