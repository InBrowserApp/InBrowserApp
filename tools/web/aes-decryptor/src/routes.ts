import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'aes-decryptor',
    path: '/tools/aes-decryptor',
    component: () => import('./AesDecryptorView.vue'),
  },
] as const
