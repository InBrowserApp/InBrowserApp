import type { ToolRoute } from '@shared/tools'
import { toolID, path } from './info'

export const routes: ToolRoute[] = [
  {
    name: toolID,
    path,
    component: () => import('./GifToApngConverterView.vue'),
  },
]
