import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'sitemap-xml-generator',
    path: '/tools/sitemap-xml-generator',
    component: () => import('./SitemapXmlGeneratorView.vue'),
  },
] as const
