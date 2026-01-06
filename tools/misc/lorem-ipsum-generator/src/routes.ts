import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'lorem-ipsum-generator',
    path: '/tools/misc/lorem-ipsum-generator',
    component: () => import('./LoremIpsumGeneratorView.vue'),
  },
] as const
