import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('url component encoder decoder exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('url-component-encoder-decoder')
    expect(toolInfo.path).toBe('/tools/url-component-encoder-decoder')
    expect(toolInfo.tags).toContain('url')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('URL Component Encoder and Decoder')
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
