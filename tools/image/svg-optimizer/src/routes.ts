import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'svg-optimizer',
    path: '/tools/svg-optimizer',
    component: () => import('./SvgOptimizerView.vue'),
  },
] as const
