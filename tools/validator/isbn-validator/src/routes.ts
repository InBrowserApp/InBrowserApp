import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'isbn-validator',
    path: '/tools/isbn-validator',
    component: () => import('./ISBNValidatorView.vue'),
  },
] as const
