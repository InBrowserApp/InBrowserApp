import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'file-to-data-uri-converter',
    path: '/tools/file-to-data-uri-converter',
    component: () => import('./FileToDataUriConverterView.vue'),
  },
] as const
