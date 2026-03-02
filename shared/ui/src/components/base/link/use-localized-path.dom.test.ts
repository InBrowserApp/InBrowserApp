import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const routeState = { path: '/tools' }
const resolve = vi.fn((to: unknown) => ({
  fullPath: typeof to === 'string' ? to : '/tools/search',
}))

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRoute: () => routeState,
    useRouter: () => ({ resolve }),
  }
})

describe('useLocalizedPath', () => {
  beforeEach(() => {
    resolve.mockClear()
    routeState.path = '/tools'
    window.history.replaceState({}, '', '/tools')
  })
  it('returns raw path for string targets without language prefix', async () => {
    const { useLocalizedPath } = await import('./use-localized-path')

    routeState.path = '/tools'
    const target = ref('/tools')
    const { localizedPath } = useLocalizedPath(target)

    expect(localizedPath.value).toBe('/tools')
  })

  it('resolves route objects and prefixes active language', async () => {
    const { useLocalizedPath } = await import('./use-localized-path')

    routeState.path = '/en/tools'
    const { localizedPath } = useLocalizedPath({ name: 'search-tools' })

    expect(localizedPath.value).toBe('/en/tools/search')
    expect(resolve).toHaveBeenLastCalledWith({ name: 'search-tools' })
  })
})
