import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'json-schema-generator',
    path: '/tools/json-schema-generator',
    component: () => import('./JsonSchemaGeneratorView.vue'),
  },
] as const
