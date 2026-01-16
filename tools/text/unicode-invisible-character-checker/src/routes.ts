import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'unicode-invisible-character-checker',
    path: '/tools/unicode-invisible-character-checker',
    component: () => import('./UnicodeInvisibleCharacterCheckerView.vue'),
  },
] as const
