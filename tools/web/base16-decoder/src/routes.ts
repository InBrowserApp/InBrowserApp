import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'base16-decoder',
    path: '/tools/base16-decoder',
    component: () => import('./Base16DecoderView.vue'),
  },
] as const
