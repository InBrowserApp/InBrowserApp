import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'iban-validator',
    path: '/tools/iban-validator',
    component: () => import('./IBANValidatorView.vue'),
  },
] as const
