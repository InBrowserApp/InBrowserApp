import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'ssh-key-generator',
    path: '/tools/ssh-key-generator',
    component: () => import('./SshKeyGeneratorView.vue'),
  },
] as const
