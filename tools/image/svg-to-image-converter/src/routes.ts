import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'svg-to-image-converter',
    path: '/tools/svg-to-image-converter',
    component: () => import('./SvgToImageConverterView.vue'),
  },
] as const
