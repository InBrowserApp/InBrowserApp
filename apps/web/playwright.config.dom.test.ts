import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@playwright/test', () => ({
  defineConfig: <T>(config: T) => config,
  devices: {
    'Desktop Chrome': { browserName: 'chromium' },
    'Desktop Firefox': { browserName: 'firefox' },
    'Desktop Safari': { browserName: 'webkit' },
  },
}))

const originalCI = process.env.CI

async function loadConfig(ciValue?: string) {
  if (ciValue === undefined) {
    delete process.env.CI
  } else {
    process.env.CI = ciValue
  }

  vi.resetModules()
  const module = await import('./playwright.config.ts')
  return module.default
}

describe('playwright config', () => {
  afterEach(() => {
    if (originalCI === undefined) {
      delete process.env.CI
    } else {
      process.env.CI = originalCI
    }
  })

  it('uses local defaults when CI is not set', async () => {
    const config = await loadConfig(undefined)

    expect(config.forbidOnly).toBe(false)
    expect(config.retries).toBe(0)
    expect(config.workers).toBeUndefined()
    expect(config.use?.baseURL).toBe('http://localhost:5173')
    expect(config.use?.headless).toBe(false)
    expect(config.webServer?.port).toBe(5173)
    expect(config.webServer?.reuseExistingServer).toBe(true)
    expect(config.projects).toHaveLength(3)
  })

  it('switches retries, workers, and server settings on CI', async () => {
    const config = await loadConfig('1')

    expect(config.forbidOnly).toBe(true)
    expect(config.retries).toBe(2)
    expect(config.workers).toBe(1)
    expect(config.use?.baseURL).toBe('http://localhost:4173')
    expect(config.use?.headless).toBe(true)
    expect(config.webServer?.command).toBe('pnpm run preview')
    expect(config.webServer?.port).toBe(4173)
    expect(config.webServer?.reuseExistingServer).toBe(false)
  })
})
