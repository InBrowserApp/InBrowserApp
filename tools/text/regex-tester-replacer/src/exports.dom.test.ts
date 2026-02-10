import { describe, expect, it } from 'vitest'
import { routes } from './routes'
import * as indexExports from './index'
import * as info from './info'

describe('regex tester replacer exports', () => {
  it('exports tool metadata and routes', async () => {
    expect(indexExports.toolInfo.toolID).toBe(info.toolID)
    expect(indexExports.toolInfo.path).toBe(info.path)
    expect(routes).toHaveLength(1)
    expect(routes[0]?.name).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)

    const componentLoader = routes[0]?.component
    expect(typeof componentLoader).toBe('function')

    if (typeof componentLoader !== 'function') {
      throw new Error('Route component loader is missing')
    }

    const component = await (componentLoader as () => Promise<{ default: unknown }>)()
    expect(component.default).toBeDefined()
    expect(component.default).toBeTypeOf('object')
  })
})
