import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'css-gradient-generator',
    path: '/tools/css-gradient-generator',
    component: () => import('./CssGradientGeneratorView.vue'),
  },
] as const
