import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'robots-txt-tester',
    path: '/tools/robots-txt-tester',
    component: () => import('./RobotsTxtTesterView.vue'),
  },
]
