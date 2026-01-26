import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'chinese-uppercase-number-converter',
    path: '/tools/chinese-uppercase-number-converter',
    component: () => import('./ChineseUppercaseNumberConverterView.vue'),
  },
] as const
