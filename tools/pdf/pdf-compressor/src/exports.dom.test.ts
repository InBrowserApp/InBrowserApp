import { describe, expect, it } from 'vitest'
import { toolInfo } from './index'
import { routes } from './routes'
import * as info from './info'

describe('pdf-compressor exports', () => {
  it('re-exports tool info', () => {
    expect(toolInfo).toBe(info)
    expect(info.toolID).toBe('pdf-compressor')
    expect(info.path).toBe('/tools/pdf-compressor')
    expect(info.features).toEqual(['offline'])
  })

  it('registers the route', async () => {
    expect(routes).toEqual([
      {
        name: 'pdf-compressor',
        path: '/tools/pdf-compressor',
        component: expect.any(Function),
      },
    ])

    const component = routes[0]?.component as (() => Promise<{ default: unknown }>) | undefined
    expect(component).toBeTypeOf('function')

    const viewModule = await component!()

    expect(viewModule.default).toBeDefined()
  })
})
