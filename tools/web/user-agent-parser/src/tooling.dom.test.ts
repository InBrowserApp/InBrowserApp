import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'

describe('user agent parser tool metadata', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('user-agent-parser')
    expect(toolInfo.path).toBe('/tools/user-agent-parser')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toContain('User-Agent')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
  })

  it('exports routes that match the tool path', async () => {
    expect(routes).toHaveLength(1)
    expect(routes[0].name).toBe(toolInfo.toolID)
    expect(routes[0].path).toBe(toolInfo.path)
    expect(typeof routes[0].component).toBe('function')

    const module = await routes[0].component()
    expect(module).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexToolInfo.toolID).toBe(toolInfo.toolID)
  })
})
