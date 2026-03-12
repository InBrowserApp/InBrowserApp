import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'totp-generator',
    path: '/tools/totp-generator',
    component: () => import('./TotpGeneratorView.vue'),
  },
] as const
