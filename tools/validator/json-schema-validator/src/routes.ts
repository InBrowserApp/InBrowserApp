import type { ToolRoute } from '@shared/tools'

export const routes: ToolRoute[] = [
  {
    name: 'json-schema-validator',
    path: '/tools/json-schema-validator',
    component: () => import('./JsonSchemaValidatorView.vue'),
  },
] as const
