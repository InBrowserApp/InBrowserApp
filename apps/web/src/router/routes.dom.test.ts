import { describe, expect, it, vi } from 'vitest'
import { supportedLanguages } from '@shared/locale'

vi.mock('@registry/tools/routes', () => ({
  routes: [
    {
      path: '/tools/mock-tool',
      name: 'mock-tool',
      component: () => Promise.resolve({ default: {} }),
    },
  ],
}))

describe('router routes', () => {
  it('keeps the unlocalized routes and appends tool routes', async () => {
    const { routesWithoutI18n } = await import('./routes')

    expect(routesWithoutI18n.map((route) => route.path)).toEqual([
      '/',
      '/tools',
      '/tools/search',
      '/tools/mock-tool',
    ])
  })

  it('loads lazy route components', async () => {
    const { routesWithoutI18n } = await import('./routes')

    const loaders = routesWithoutI18n
      .map((route) => route.component)
      .filter(
        (component): component is () => Promise<{ default: unknown }> =>
          typeof component === 'function',
      )

    const modules = await Promise.all(loaders.map((load) => load()))

    expect(modules).toHaveLength(4)
    expect(modules.every((module) => 'default' in module)).toBe(true)
  })

  it('adds aliases for every supported language', async () => {
    const { routes } = await import('./routes')

    expect(routes).toHaveLength(4)
    expect(routes[0]?.alias).toEqual(supportedLanguages.map((lang) => `/${lang}/`))
    expect(routes[1]?.alias).toEqual(supportedLanguages.map((lang) => `/${lang}/tools`))
    expect(routes[2]?.alias).toEqual(supportedLanguages.map((lang) => `/${lang}/tools/search`))
    expect(routes[3]?.alias).toEqual(supportedLanguages.map((lang) => `/${lang}/tools/mock-tool`))
  })
})
