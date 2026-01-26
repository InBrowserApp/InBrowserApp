import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'screen-recorder',
    path: '/tools/screen-recorder',
    component: () => import('./ScreenRecorderView.vue'),
  },
] as const
