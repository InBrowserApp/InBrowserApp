import { describe, expect, it, vi } from 'vitest'

vi.mock('@shared/locale', () => ({
  supportedLanguages: ['en', 'zh-CN'],
}))

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

    expect(modules).toHaveLength(3)
    expect(modules.every((module) => 'default' in module)).toBe(true)
  })

  it('adds aliases for every supported language', async () => {
    const { routes } = await import('./routes')

    expect(routes).toHaveLength(3)
    expect(routes[0]?.alias).toEqual(['/en/', '/zh-CN/'])
    expect(routes[1]?.alias).toEqual(['/en/tools', '/zh-CN/tools'])
    expect(routes[2]?.alias).toEqual(['/en/tools/mock-tool', '/zh-CN/tools/mock-tool'])
  })
})
