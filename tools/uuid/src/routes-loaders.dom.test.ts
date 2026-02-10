import { describe, expect, it } from 'vitest'
import type { ToolRoute } from '@shared/tools'

import { routes as ulidRoutes } from './ulid-generator/routes'
import ULIDGeneratorView from './ulid-generator/ULIDGeneratorView.vue'
import { routes as uuidBaseRoutes } from './uuid-base64-integer-octal-binary-converter/routes'
import UUIDBase64HexDecimalOctalBinaryConverterView from './uuid-base64-integer-octal-binary-converter/UUIDBase64HexDecimalOctalBinaryConverterView.vue'
import { routes as uuidDecoderRoutes } from './uuid-decoder/routes'
import UUIDDecoderView from './uuid-decoder/UUIDDecoderView.vue'
import { routes as uuidMaxRoutes } from './uuid-max-generator/routes'
import MaxUUIDGeneratorView from './uuid-max-generator/MaxUUIDGeneratorView.vue'
import { routes as uuidNilRoutes } from './uuid-nil-generator/routes'
import NilUUIDGeneratorView from './uuid-nil-generator/NilUUIDGeneratorView.vue'
import { routes as uuidToolsRoutes } from './uuid-tools/routes'
import UUIDToolsView from './uuid-tools/UUIDToolsView.vue'
import { routes as uuidV1Routes } from './uuid-v1-generator/routes'
import UUIDV1GeneratorView from './uuid-v1-generator/UUIDV1GeneratorView.vue'
import { routes as uuidV1V6Routes } from './uuid-v1-v6-converter/routes'
import UUIDV1V6ConverterView from './uuid-v1-v6-converter/UUIDV1V6ConverterView.vue'
import { routes as uuidV3Routes } from './uuid-v3-generator/routes'
import UUIDV3GeneratorView from './uuid-v3-generator/UUIDV3GeneratorView.vue'
import { routes as uuidV4BulkRoutes } from './uuid-v4-bulk-generator/routes'
import UUIDV4BulkGeneratorView from './uuid-v4-bulk-generator/UUIDV4BulkGeneratorView.vue'
import { routes as uuidV4Routes } from './uuid-v4-generator/routes'
import UUIDV4GeneratorView from './uuid-v4-generator/UUIDV4GeneratorView.vue'
import { routes as uuidV5Routes } from './uuid-v5-generator/routes'
import UUIDV5GeneratorView from './uuid-v5-generator/UUIDV5GeneratorView.vue'
import { routes as uuidV6Routes } from './uuid-v6-generator/routes'
import UUIDV6GeneratorView from './uuid-v6-generator/UUIDV6GeneratorView.vue'
import { routes as uuidV7Routes } from './uuid-v7-generator/routes'
import UUIDV7GeneratorView from './uuid-v7-generator/UUIDV7GeneratorView.vue'
import { routes as uuidValidatorRoutes } from './uuid-validator/routes'
import UUIDValidatorView from './uuid-validator/UUIDValidatorView.vue'

type RouteCase = {
  name: string
  expectedPaths: string[]
  routes: ToolRoute[]
  view: unknown
}

const routeCases: RouteCase[] = [
  {
    name: 'ulid-generator',
    expectedPaths: ['/tools/ulid-generator'],
    routes: ulidRoutes,
    view: ULIDGeneratorView,
  },
  {
    name: 'uuid-base64-hex-decimal-octal-binary-converter',
    expectedPaths: ['/tools/uuid-base64-hex-decimal-octal-binary-converter'],
    routes: uuidBaseRoutes,
    view: UUIDBase64HexDecimalOctalBinaryConverterView,
  },
  {
    name: 'uuid-decoder',
    expectedPaths: ['/tools/uuid-decoder', '/tools/uuid-decoder/:uuid'],
    routes: uuidDecoderRoutes,
    view: UUIDDecoderView,
  },
  {
    name: 'uuid-max-generator',
    expectedPaths: ['/tools/uuid-max-generator'],
    routes: uuidMaxRoutes,
    view: MaxUUIDGeneratorView,
  },
  {
    name: 'uuid-nil-generator',
    expectedPaths: ['/tools/uuid-nil-generator'],
    routes: uuidNilRoutes,
    view: NilUUIDGeneratorView,
  },
  {
    name: 'uuid-tools',
    expectedPaths: ['/tools/uuid'],
    routes: uuidToolsRoutes,
    view: UUIDToolsView,
  },
  {
    name: 'uuid-v1-generator',
    expectedPaths: ['/tools/uuid-v1-generator'],
    routes: uuidV1Routes,
    view: UUIDV1GeneratorView,
  },
  {
    name: 'uuid-v1-v6-converter',
    expectedPaths: ['/tools/uuid-v1-v6-converter'],
    routes: uuidV1V6Routes,
    view: UUIDV1V6ConverterView,
  },
  {
    name: 'uuid-v3-generator',
    expectedPaths: ['/tools/uuid-v3-generator'],
    routes: uuidV3Routes,
    view: UUIDV3GeneratorView,
  },
  {
    name: 'uuid-v4-bulk-generator',
    expectedPaths: ['/tools/uuid-v4-bulk-generator'],
    routes: uuidV4BulkRoutes,
    view: UUIDV4BulkGeneratorView,
  },
  {
    name: 'uuid-v4-generator',
    expectedPaths: ['/tools/uuid-v4-generator'],
    routes: uuidV4Routes,
    view: UUIDV4GeneratorView,
  },
  {
    name: 'uuid-v5-generator',
    expectedPaths: ['/tools/uuid-v5-generator'],
    routes: uuidV5Routes,
    view: UUIDV5GeneratorView,
  },
  {
    name: 'uuid-v6-generator',
    expectedPaths: ['/tools/uuid-v6-generator'],
    routes: uuidV6Routes,
    view: UUIDV6GeneratorView,
  },
  {
    name: 'uuid-v7-generator',
    expectedPaths: ['/tools/uuid-v7-generator'],
    routes: uuidV7Routes,
    view: UUIDV7GeneratorView,
  },
  {
    name: 'uuid-validator',
    expectedPaths: ['/tools/uuid-validator'],
    routes: uuidValidatorRoutes,
    view: UUIDValidatorView,
  },
]

describe('uuid route loaders', () => {
  it.each(routeCases)('loads $name routes lazily', async ({ routes, expectedPaths, view }) => {
    expect(routes.map((route) => route.path)).toEqual(expectedPaths)

    for (const route of routes) {
      expect(typeof route.component).toBe('function')
      const componentLoader = route.component as () => Promise<{ default: unknown }>

      const loaded = await componentLoader()
      expect(loaded.default).toBe(view)
    }
  })
})
