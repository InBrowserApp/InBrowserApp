import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('roman numeral converter exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('roman-numeral-converter')
    expect(toolInfo.path).toBe('/tools/roman-numeral-converter')
    expect(toolInfo.tags).toContain('roman')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('Roman Numeral ↔ Arabic Number Converter')
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
