import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'pdf-page-organizer',
    path: '/tools/pdf-page-organizer',
    component: () => import('./PDFPageOrganizerView.vue'),
  },
] as const
