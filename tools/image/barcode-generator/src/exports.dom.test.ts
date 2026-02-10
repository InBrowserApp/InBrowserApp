import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('barcode-generator exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('barcode-generator')
    expect(toolInfo.path).toBe('/tools/barcode-generator')
    expect(toolInfo.tags).toEqual(['barcode', 'code128', 'ean', 'upc', 'generator', 'image'])
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('Barcode Generator')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
