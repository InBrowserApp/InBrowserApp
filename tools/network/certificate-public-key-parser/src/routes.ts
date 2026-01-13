import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'certificate-public-key-parser',
    path: '/tools/certificate-public-key-parser',
    component: () => import('./CertificatePublicKeyParserView.vue'),
  },
] as const
