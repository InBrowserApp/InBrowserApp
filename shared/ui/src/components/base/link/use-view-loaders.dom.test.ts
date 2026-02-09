import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

const matchedLoader = vi.fn(async () => ({ default: {} }))
const prefetchLoader = vi.fn(async () => ({ default: {} }))

type ResolvedRoute = {
  path: string
  matched: Array<{
    components?: Record<string, unknown>
  }>
  meta?: {
    prefetchComponents?: Array<{
      loader: () => Promise<unknown>
      priority?: 'highest' | 'high' | 'medium' | 'low' | 'lowest'
      timeout?: number
      delay?: number
    }>
  }
}

const resolvedRoute = ref<ResolvedRoute>({
  path: '/tools',
  matched: [
    {
      components: {
        default: matchedLoader,
        helper: { render: () => null },
      },
    },
  ],
  meta: {
    prefetchComponents: [
      {
        loader: prefetchLoader,
        priority: 'low',
      },
    ],
  },
})

const resolve = vi.fn(() => resolvedRoute.value)

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRouter: () => ({ resolve }),
  }
})

describe('useViewLoaders', () => {
  it('collects matched view loaders and route-level prefetch loaders', async () => {
    const { useViewLoaders } = await import('./use-view-loaders')

    const to = ref('/tools')
    const { route, viewLoaders, prefetchComponents, loaders } = useViewLoaders(to)

    expect(route.value.path).toBe('/tools')
    expect(viewLoaders.value).toHaveLength(1)
    expect(viewLoaders.value[0]?.loader).toBe(matchedLoader)
    expect(viewLoaders.value[0]?.priority).toBe('highest')

    expect(prefetchComponents.value).toEqual([
      {
        loader: prefetchLoader,
        priority: 'low',
      },
    ])

    expect(loaders.value).toEqual([
      {
        loader: matchedLoader,
        priority: 'highest',
      },
      {
        loader: prefetchLoader,
        priority: 'low',
      },
    ])
  })

  it('returns an empty loader list when route has no matches or meta loaders', async () => {
    const { useViewLoaders } = await import('./use-view-loaders')

    resolvedRoute.value = {
      path: '/empty',
      matched: [],
      meta: {},
    }

    const { loaders, viewLoaders, prefetchComponents } = useViewLoaders('/empty')

    expect(viewLoaders.value).toEqual([])
    expect(prefetchComponents.value).toEqual([])
    expect(loaders.value).toEqual([])
  })
})
