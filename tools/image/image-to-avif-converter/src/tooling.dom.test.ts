import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { toolInfo as exportedToolInfo } from './index'
import { routes } from './routes'

describe('tool metadata', () => {
  it('exports the AVIF tool metadata', () => {
    expect(toolInfo.toolID).toBe('image-to-avif-converter')
    expect(toolInfo.path).toBe('/tools/image-to-avif-converter')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.tags).toEqual(expect.arrayContaining(['image', 'avif', 'converter']))
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
  })

  it('re-exports the tool info from index', () => {
    expect(exportedToolInfo.toolID).toBe(toolInfo.toolID)
  })

  it('exposes a lazy route that points to the AVIF view', async () => {
    expect(routes).toHaveLength(1)

    const route = routes[0]
    expect(route?.name).toBe(toolInfo.toolID)
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.component).toBeTypeOf('function')

    const loadComponent = route!.component as () => Promise<unknown>
    const module = await loadComponent()
    expect(module).toHaveProperty('default')
  })
})
