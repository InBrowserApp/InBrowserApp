import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'prc-id-validator',
    path: '/tools/prc-id-validator',
    component: () => import('./PRCResidentIDValidatorView.vue'),
  },
] as const
