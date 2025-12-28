import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'base64-encoder-decoder',
    path: '/tools/base64-encoder-decoder',
    component: () => import('./Base64EncoderDecoderView.vue'),
  },
] as const
