import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'bic-swift-validator',
    path: '/tools/bic-swift-validator',
    component: () => import('./BICSwiftValidatorView.vue'),
  },
] as const
