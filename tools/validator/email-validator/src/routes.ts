import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'email-validator',
    path: '/tools/email-validator',
    component: () => import('./EmailValidatorView.vue'),
  },
] as const
