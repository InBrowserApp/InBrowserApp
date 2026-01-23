import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'cityhash64-hash-text-or-file',
    path: '/tools/cityhash64-hash-text-or-file',
    component: () => import('./CityHash64HashTextOrFileView.vue'),
  },
] as const
