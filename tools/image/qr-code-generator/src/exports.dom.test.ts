import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexExports from './index'

describe('qr-code-generator exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('qr-code-generator')
    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loaded = await componentLoader()
    expect(loaded).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
