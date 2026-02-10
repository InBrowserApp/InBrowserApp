import { describe, expect, it } from 'vitest'
import { generateAssets, generateManifest, generateManifestText, normalizePath } from './index'
import type { GeneralInfoOptions } from './types'

const baseOptions: GeneralInfoOptions = {
  name: 'My App',
  short_name: 'App',
  description: 'Demo app',
  start_url: '/',
  display: 'standalone',
  theme_color: '#ffffff',
  theme_color_dark_enabled: false,
  theme_color_dark: undefined,
  background_color: '#000000',
  path: '/assets',
}

describe('general-info utilities', () => {
  it('normalizes paths with trailing slash', () => {
    expect(normalizePath('/assets')).toBe('/assets/')
    expect(normalizePath('/assets/')).toBe('/assets/')
  })

  it('generates manifest JSON with icons and description', () => {
    const json = generateManifestText(baseOptions)
    const manifest = JSON.parse(json) as Record<string, unknown>

    expect(manifest.name).toBe('My App')
    expect(manifest.short_name).toBe('App')
    expect(manifest.description).toBe('Demo app')

    const icons = manifest.icons as Array<{ src: string; purpose: string }>
    expect(icons[0]?.src).toBe('/assets/pwa-192x192.png')
    expect(icons[2]?.purpose).toBe('maskable')
  })

  it('omits description when empty', () => {
    const json = generateManifestText({ ...baseOptions, description: '' })
    const manifest = JSON.parse(json) as Record<string, unknown>
    expect(manifest.description).toBeUndefined()
  })

  it('generates a manifest blob and asset file', async () => {
    const blob = await generateManifest(baseOptions)
    const text = await blob.text()
    expect(text).toContain('"name": "My App"')

    const files = await generateAssets(baseOptions)
    expect(files).toHaveLength(1)
    expect(files[0]?.name).toBe('site.webmanifest')
    expect(files[0]?.type).toBe('application/manifest+json')
  })
})
