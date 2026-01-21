import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'markdown-previewer',
    path: '/tools/markdown-previewer',
    component: () => import('./MarkdownPreviewerView.vue'),
  },
]

export default routes
