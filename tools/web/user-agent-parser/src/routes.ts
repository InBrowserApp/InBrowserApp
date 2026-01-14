import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'user-agent-parser',
    path: '/tools/user-agent-parser',
    component: () => import('./UserAgentParserView.vue'),
  },
] as const
