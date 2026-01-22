import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'color-contrast-checker',
    path: '/tools/color-contrast-checker',
    component: () => import('./ColorContrastCheckerView.vue'),
  },
] as const
