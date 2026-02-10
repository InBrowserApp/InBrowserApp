import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexExports from './index'

describe('placeholder-image-generator exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('placeholder-image-generator')
    expect(routes[0]?.path).toBe(toolInfo.path)

    const loader = routes[0]?.component as () => Promise<{ default: unknown }>
    const loaded = await loader()
    expect(loaded).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
