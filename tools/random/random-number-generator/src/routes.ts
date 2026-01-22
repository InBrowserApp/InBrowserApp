import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'random-number-generator',
    path: '/tools/random/random-number-generator',
    component: () => import('./RandomNumberGeneratorView.vue'),
  },
]
