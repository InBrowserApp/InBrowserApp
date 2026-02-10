import { describe, it, expect } from 'vitest'
import BICSwiftValidatorView from './BICSwiftValidatorView.vue'
import { toolID, path } from './info'
import { routes } from './routes'

describe('bic-swift-validator routes', () => {
  it('exports a route that matches tool info and loads the view', async () => {
    expect(routes).toHaveLength(1)

    const route = routes[0]
    expect(route).toBeDefined()
    if (!route) {
      throw new Error('Expected route to be defined')
    }

    expect(route.name).toBe(toolID)
    expect(route.path).toBe(path)

    const loader = route.component as () => Promise<{ default: unknown }>
    const component = await loader()
    expect(component.default).toBe(BICSwiftValidatorView)
  })
})
