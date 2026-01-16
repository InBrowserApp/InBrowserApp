import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'nanoid-generator',
    path: '/tools/random/nanoid-generator',
    component: () => import('./NanoidGeneratorView.vue'),
  },
]
