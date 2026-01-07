import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'credit-card-validator',
    path: '/tools/credit-card-validator',
    component: () => import('./CreditCardValidatorView.vue'),
  },
] as const
