import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'regex-tester-replacer',
    path: '/tools/regex-tester-replacer',
    component: () => import('./RegexTesterReplacerView.vue'),
  },
] as const
