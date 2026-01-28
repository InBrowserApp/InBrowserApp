import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'camera',
    path: '/tools/camera',
    component: () => import('./CameraView.vue'),
  },
] as const
