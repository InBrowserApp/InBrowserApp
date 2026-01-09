import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'qr-code-reader',
    path: '/tools/qr-code-reader',
    component: () => import('./QRCodeReaderView.vue'),
  },
] as const
