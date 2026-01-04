import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'data-uri-to-file-converter',
    path: '/tools/data-uri-to-file-converter',
    component: () => import('./DataUriToFileConverterView.vue'),
  },
] as const
