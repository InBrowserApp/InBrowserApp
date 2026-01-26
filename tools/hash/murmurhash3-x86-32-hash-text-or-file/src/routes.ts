import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'murmurhash3-x86-32-hash-text-or-file',
    path: '/tools/murmurhash3-x86-32-hash-text-or-file',
    component: () => import('./MurmurHash3X86_32HashTextOrFileView.vue'),
  },
] as const
