import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import * as index from './index'
import { routes } from './routes'

describe('pdf page number adder exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('pdf-page-number-adder')
    expect(toolInfo.path).toBe('/tools/pdf-page-number-adder')
    expect(toolInfo.tags).toContain('pdf')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('PDF Page Number Adder')
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
