import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'radio-timecode',
    path: '/tools/radio-timecode',
    component: () => import('./RadioTimecodeView.vue'),
  },
]
