import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'xml-formatter',
    path: '/tools/xml-formatter',
    component: () => import('./XmlFormatterView.vue'),
  },
] as const
