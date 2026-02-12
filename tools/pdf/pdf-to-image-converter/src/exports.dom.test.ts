import { describe, expect, it } from 'vitest'
import { toolInfo } from './index'
import { routes } from './routes'

describe('pdf-to-image-converter exports', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('pdf-to-image-converter')
    expect(toolInfo.path).toBe('/tools/pdf-to-image-converter')
    expect(toolInfo.tags).toContain('pdf')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toContain('PDF')
  })

  it('exports route definition', async () => {
    expect(routes).toHaveLength(1)
    expect(routes[0]?.name).toBe('pdf-to-image-converter')

    const routeComponent = routes[0]?.component
    expect(routeComponent).toBeDefined()

    if (typeof routeComponent !== 'function') {
      return
    }

    const loadComponent = routeComponent as () => Promise<unknown>
    const component = await loadComponent()
    expect(component).toBeDefined()
  })
})
