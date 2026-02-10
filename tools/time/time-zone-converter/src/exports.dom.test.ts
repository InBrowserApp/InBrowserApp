import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as exportedInfo } from './index'

describe('time-zone-converter exports', () => {
  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('time-zone-converter')
    expect(toolInfo.path).toBe('/tools/time-zone-converter')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('Time Zone Converter')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)

    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe('time-zone-converter')

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(exportedInfo.toolID).toBe(toolInfo.toolID)
  })
})
