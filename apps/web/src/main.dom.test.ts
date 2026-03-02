import { describe, expect, it, vi } from 'vitest'

const mount = vi.fn()
const app = {
  use: vi.fn(() => app),
  mount,
}

const createApp = vi.fn(() => app)

vi.mock('vue', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue')>()

  return {
    ...original,
    createApp,
  }
})

vi.mock('./App.vue', () => ({
  default: { name: 'RootApp' },
}))

vi.mock('./router', () => ({
  default: { name: 'router-plugin' },
}))

const createHead = vi.fn(() => ({ name: 'head-plugin' }))
vi.mock('@unhead/vue/client', () => ({
  createHead,
}))

const createPinia = vi.fn(() => ({ name: 'pinia-plugin' }))
vi.mock('pinia', () => ({
  createPinia,
}))

describe('main entry', () => {
  it('registers plugins and mounts the app', async () => {
    await import('./main')

    expect(createApp).toHaveBeenCalledWith({ name: 'RootApp' })
    expect(createHead).toHaveBeenCalledTimes(1)
    expect(createPinia).toHaveBeenCalledTimes(1)

    expect(app.use).toHaveBeenCalledTimes(4)
    expect(app.mount).toHaveBeenCalledWith('#app')
  })
})
