import { describe, expect, it, vi } from 'vitest'
import { routes } from './routes'

vi.mock('./IcalEventGeneratorView.vue', () => ({
  default: { name: 'IcalEventGeneratorView' },
}))

describe('ical event generator routes', () => {
  it('resolves the route component', async () => {
    const route = routes[0]

    expect(route).toBeDefined()
    expect(route?.path).toBe('/tools/ical-event-generator')

    if (!route || typeof route.component !== 'function') {
      throw new Error('Route component loader is missing')
    }

    const loader = route.component as unknown as () => Promise<unknown>
    const module = await loader()

    expect(module).toHaveProperty('default')
  })
})
