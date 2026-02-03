import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as exportedInfo } from './index'

describe('time-zone-converter exports', () => {
  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('time-zone-converter')
    expect(toolInfo.path).toBe('/tools/time-zone-converter')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('Time Zone Converter')

    expect(routes[0]?.path).toBe(toolInfo.path)
    expect(routes[0]?.name).toBe('time-zone-converter')
  })

  it('re-exports tool info from index', () => {
    expect(exportedInfo.toolID).toBe(toolInfo.toolID)
  })
})
