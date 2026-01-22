import type { ToolRoute } from '@shared/tools'
import { toolID, path } from './info'

export const routes: ToolRoute[] = [
  {
    toolID,
    path,
    name: toolID,
    component: () => import('./CssBoxShadowGeneratorView.vue'),
  },
]
