import { describe, expect, it } from 'vitest'
import * as index from './index'
import * as toolInfo from './info'
import { routes } from './routes'

describe('pdf watermark adder exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('pdf-watermark-adder')
    expect(toolInfo.path).toBe('/tools/pdf-watermark-adder')
    expect(toolInfo.tags).toContain('pdf')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('PDF Watermark Adder')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route?.name).toBe(toolInfo.toolID)
    expect(route?.path).toBe(toolInfo.path)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loaded = await componentLoader()
    expect(loaded).toHaveProperty('default')
  })
})
