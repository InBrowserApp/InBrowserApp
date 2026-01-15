import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'ksuid-generator',
    path: '/tools/random/ksuid-generator',
    component: () => import('./KsuidGeneratorView.vue'),
  },
]
