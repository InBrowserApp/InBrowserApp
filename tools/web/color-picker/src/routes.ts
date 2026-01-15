import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'color-picker',
    path: '/tools/color-picker',
    component: () => import('./ColorPickerView.vue'),
  },
] as const
