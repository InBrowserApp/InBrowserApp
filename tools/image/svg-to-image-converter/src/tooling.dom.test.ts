import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'

describe('svg to image converter tool metadata', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('svg-to-image-converter')
    expect(toolInfo.path).toBe('/tools/svg-to-image-converter')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toContain('SVG')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
  })

  it('exports routes that match the tool path', async () => {
    expect(routes).toHaveLength(1)
    const route = routes[0]
    if (!route) {
      throw new Error('Missing route configuration')
    }

    expect(route.name).toBe(toolInfo.toolID)
    expect(route.path).toBe(toolInfo.path)
    expect(route.component).toBeTruthy()

    if (typeof route.component !== 'function') {
      throw new Error('Expected a lazy component loader')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexToolInfo.toolID).toBe(toolInfo.toolID)
  })
})
