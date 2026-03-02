import { effectScope, nextTick, reactive, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const route = reactive({
  path: '/en/tools',
})

const resolve = vi.fn((location: { path?: string }) => ({
  path: location.path ?? '/resolved',
}))

const locale = ref('en')

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRoute: () => route,
    useRouter: () => ({ resolve }),
  }
})

vi.mock('vue-i18n', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-i18n')>()

  return {
    ...original,
    useI18n: () => ({ locale }),
  }
})

describe('use-site-language', () => {
  const languageSpy = vi.spyOn(navigator, 'language', 'get')

  beforeEach(() => {
    route.path = '/en/tools'
    resolve.mockClear()
    locale.value = 'en'
    document.documentElement.lang = ''
    window.history.replaceState({}, '', '/en/tools')
    languageSpy.mockReturnValue('en-US')
  })

  afterEach(() => {
    languageSpy.mockReset()
  })

  it('reads site language from route path and location fallback', async () => {
    const { useSiteLanguage } = await import('./use-site-language')

    route.path = '/fr/tools'
    window.history.replaceState({}, '', '/en/tools')

    const { language } = useSiteLanguage()
    expect(language.value).toBe('fr')

    route.path = '/'
    expect(language.value).toBe('en')
  })

  it('extracts locale from explicit paths or window location', async () => {
    const { getLocaleFromPath } = await import('./use-site-language')

    expect(getLocaleFromPath('/zh-CN/tools')).toBe('zh-CN')

    window.history.replaceState({}, '', '/de/tools')
    expect(getLocaleFromPath()).toBe('de')

    expect(getLocaleFromPath('/unknown/path')).toBeUndefined()
  })

  it('updates locale and document lang through useSetSiteLanguage', async () => {
    const { useSetSiteLanguage } = await import('./use-site-language')

    route.path = '/fr/tools'
    const scope = effectScope()

    scope.run(() => {
      useSetSiteLanguage()
    })
    await nextTick()

    expect(locale.value).toBe('fr')
    expect(document.documentElement.lang).toBe('fr')

    route.path = '/tools'
    languageSpy.mockReturnValue('zh-CN')
    await nextTick()

    expect(locale.value).toBe('zh-CN')
    expect(document.documentElement.lang).toBe('zh-CN')

    scope.stop()
  })

  it('builds localized paths for current language', async () => {
    const { useSiteLanguagePath } = await import('./use-site-language')

    route.path = '/en/tools'
    const { path } = useSiteLanguagePath({ path: '/tools' })
    expect(path.value).toBe('/en/tools')

    route.path = '/tools'
    expect(path.value).toBe('/tools')
    expect(resolve).toHaveBeenCalled()
  })
})
