import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'

describe('csr generator metadata', () => {
  it('exports tool info', () => {
    expect(toolInfo.toolID).toBe('csr-generator')
    expect(toolInfo.path).toBe('/tools/csr-generator')
    expect(toolInfo.features).toEqual(['offline'])
  })

  it('exposes routes matching tool info', async () => {
    expect(routes).toHaveLength(1)
    const route = routes[0]
    if (!route) {
      throw new Error('Missing route configuration')
    }

    expect(route.path).toBe(toolInfo.path)
    expect(route.name).toBe(toolInfo.toolID)
    expect(route.component).toBeTruthy()

    if (typeof route.component !== 'function') {
      throw new Error('Expected a lazy component loader')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })

  it('re-exports tool info namespace', () => {
    expect(indexToolInfo.toolID).toBe(toolInfo.toolID)
  })
})
