import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const language = ref<string | undefined>(undefined)
const resolve = vi.fn((to: unknown) => ({
  fullPath: typeof to === 'string' ? to : '/tools',
}))

vi.mock('@shared/locale', () => ({
  useSiteLanguage: () => ({ language }),
}))

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRouter: () => ({ resolve }),
  }
})

describe('useLocalizedPath', () => {
  beforeEach(() => {
    resolve.mockClear()
    language.value = undefined
  })
  it('returns raw path for string targets without language prefix', async () => {
    const { useLocalizedPath } = await import('./use-localized-path')

    language.value = undefined
    const target = ref('/tools')
    const { localizedPath } = useLocalizedPath(target)

    expect(localizedPath.value).toBe('/tools')
  })

  it('resolves route objects and prefixes active language', async () => {
    const { useLocalizedPath } = await import('./use-localized-path')

    language.value = 'en'
    const { localizedPath } = useLocalizedPath({ name: 'tools' })

    expect(localizedPath.value).toBe('/en/tools')
    expect(resolve).toHaveBeenLastCalledWith({ name: 'tools' })
  })
})
