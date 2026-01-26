import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'vin-validator',
    path: '/tools/vin-validator',
    component: () => import('./VINValidatorView.vue'),
  },
] as const
