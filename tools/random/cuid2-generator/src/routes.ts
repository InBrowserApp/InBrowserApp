import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'cuid2-generator',
    path: '/tools/random/cuid2-generator',
    component: () => import('./Cuid2GeneratorView.vue'),
  },
]
