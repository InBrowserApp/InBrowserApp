import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'dice-simulator',
    path: '/tools/random/dice-simulator',
    component: () => import('./DiceSimulatorView.vue'),
  },
]
