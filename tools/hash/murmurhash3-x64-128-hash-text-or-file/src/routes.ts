import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'murmurhash3-x64-128-hash-text-or-file',
    path: '/tools/murmurhash3-x64-128-hash-text-or-file',
    component: () => import('./MurmurHash3X64_128HashTextOrFileView.vue'),
  },
] as const
