import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'aes-encryptor',
    path: '/tools/aes-encryptor',
    component: () => import('./AesEncryptorView.vue'),
  },
] as const
