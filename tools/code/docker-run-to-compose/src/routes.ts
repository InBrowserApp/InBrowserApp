import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'docker-run-to-compose',
    path: '/tools/docker-run-to-compose',
    component: () => import('./DockerRunToComposeView.vue'),
  },
]

export default routes
