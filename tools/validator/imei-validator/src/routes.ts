import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'imei-validator',
    path: '/tools/imei-validator',
    component: () => import('./IMEIValidatorView.vue'),
  },
] as const
