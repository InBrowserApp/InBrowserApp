import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'html-entity-encoder-decoder',
    path: '/tools/html-entity-encoder-decoder',
    component: () => import('./HtmlEntityEncoderDecoderView.vue'),
  },
] as const
