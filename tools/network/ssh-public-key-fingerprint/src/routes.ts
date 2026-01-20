import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'ssh-public-key-fingerprint',
    path: '/tools/ssh-public-key-fingerprint',
    component: () => import('./SshPublicKeyFingerprintView.vue'),
  },
] as const
