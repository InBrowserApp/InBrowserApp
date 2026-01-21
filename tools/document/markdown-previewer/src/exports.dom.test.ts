import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'

describe('markdown previewer exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('markdown-previewer')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)

    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })
})
