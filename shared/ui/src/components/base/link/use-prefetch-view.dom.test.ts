import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const route = ref({
  path: '/tools/a',
  name: 'tools-a',
})

const loaders = ref<Array<{ loader: () => Promise<unknown>; priority?: string; timeout?: number }>>(
  [],
)

const loadAtIdle = vi.fn(async (loader: () => Promise<unknown>, _options?: { timeout?: number }) =>
  loader(),
)

vi.mock('./use-view-loaders', () => ({
  useViewLoaders: () => ({
    route,
    loaders,
  }),
}))

vi.mock('./load-at-idle', () => ({
  loadAtIdle,
}))

describe('usePrefetchView', () => {
  beforeEach(() => {
    route.value = {
      path: '/tools/a',
      name: 'tools-a',
    }
    loaders.value = []
    loadAtIdle.mockClear()
  })

  it('prefetches loaders by priority and skips duplicate calls', async () => {
    const callOrder: string[] = []

    loaders.value = [
      {
        priority: 'low',
        timeout: 10,
        loader: async () => {
          callOrder.push('low')
          return 'low'
        },
      },
      {
        priority: 'highest',
        timeout: 20,
        loader: async () => {
          callOrder.push('highest')
          return 'highest'
        },
      },
      {
        priority: 'medium',
        timeout: 30,
        loader: async () => {
          callOrder.push('medium')
          return 'medium'
        },
      },
    ]

    const { usePrefetchView } = await import('./use-prefetch-view')
    const { prefetch } = usePrefetchView('/tools/a')

    await prefetch()
    expect(callOrder).toEqual(['highest', 'medium', 'low'])
    expect(loadAtIdle).toHaveBeenCalledTimes(3)
    expect(loadAtIdle.mock.calls.map((call) => call[1]?.timeout)).toEqual([20, 30, 10])

    await expect(prefetch()).resolves.toBeUndefined()
    expect(loadAtIdle).toHaveBeenCalledTimes(3)
  })

  it('logs and returns undefined when no loaders are available', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const { usePrefetchView } = await import('./use-prefetch-view')
    const { prefetch } = usePrefetchView('/tools/missing')

    await expect(prefetch()).resolves.toBeUndefined()
    expect(loadAtIdle).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()

    errorSpy.mockRestore()
  })
})
