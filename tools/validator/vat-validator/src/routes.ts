import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'vat-validator',
    path: '/tools/vat-validator',
    component: () => import('./VATValidatorView.vue'),
  },
] as const
