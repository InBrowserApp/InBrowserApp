import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'barcode-reader',
    path: '/tools/barcode-reader',
    component: () => import('./BarcodeReaderView.vue'),
  },
] as const
