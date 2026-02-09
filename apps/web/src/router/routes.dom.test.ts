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
      '/tools/search',
      '/tools/mock-tool',
    ])
  })

  it('adds aliases for every supported language', async () => {
    const { routes } = await import('./routes')

    expect(routes).toHaveLength(4)
    expect(routes[0]?.alias).toEqual(['/en/', '/zh-CN/'])
    expect(routes[1]?.alias).toEqual(['/en/tools', '/zh-CN/tools'])
    expect(routes[2]?.alias).toEqual(['/en/tools/search', '/zh-CN/tools/search'])
    expect(routes[3]?.alias).toEqual(['/en/tools/mock-tool', '/zh-CN/tools/mock-tool'])
  })
})
