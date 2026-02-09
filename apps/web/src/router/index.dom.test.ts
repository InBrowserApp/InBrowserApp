import { describe, expect, it, vi } from 'vitest'

const createWebHistory = vi.fn(() => 'mock-history')
const createRouter = vi.fn((options: unknown) => ({ options }))

vi.mock('vue-router', () => ({
  createWebHistory,
  createRouter,
}))

vi.mock('./routes', () => ({
  routes: [{ path: '/tools', name: 'tools' }],
}))

describe('router index', () => {
  it('creates the router with history, routes, and top scroll behavior', async () => {
    const router = (await import('./index')).default as unknown as {
      options: {
        history: string
        routes: unknown[]
        scrollBehavior: () => { top: number }
      }
    }

    expect(createWebHistory).toHaveBeenCalledTimes(1)
    expect(createRouter).toHaveBeenCalledTimes(1)
    expect(router.options.history).toBe('mock-history')
    expect(router.options.routes).toEqual([{ path: '/tools', name: 'tools' }])
    expect(router.options.scrollBehavior()).toEqual({ top: 0 })
  })
})
