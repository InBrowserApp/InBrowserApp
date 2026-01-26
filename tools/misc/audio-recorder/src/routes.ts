import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'audio-recorder',
    path: '/tools/audio-recorder',
    component: () => import('./AudioRecorderView.vue'),
  },
] as const
