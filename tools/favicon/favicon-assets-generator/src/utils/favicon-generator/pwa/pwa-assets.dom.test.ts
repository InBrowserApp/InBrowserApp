import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PWAOptions } from './types'

const generatePWAPNG = vi.hoisted(() =>
  vi.fn(
    async (_image: Blob | undefined, _options: PWAOptions, size: number) =>
      new Blob([`pwa-${size}`], { type: 'image/png' }),
  ),
)
const generatePWAMaskablePNG = vi.hoisted(() =>
  vi.fn(
    async (_image: Blob | undefined, _options: PWAOptions, size: number) =>
      new Blob([`maskable-${size}`], { type: 'image/png' }),
  ),
)

vi.mock('./generate-pwa-png', () => ({ generatePWAPNG }))
vi.mock('./generate-pwa-maskable-png', () => ({ generatePWAMaskablePNG }))

let generateAssets: typeof import('./generate-assets').generateAssets

beforeAll(async () => {
  ;({ generateAssets } = await import('./generate-assets'))
})

const baseOptions: PWAOptions = {
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  maskable: true,
  maskableBackgroundColor: '#000000',
  maskableMargin: 0,
  margin: 0,
}

describe('pwa generate-assets', () => {
  beforeEach(() => {
    generatePWAPNG.mockClear()
    generatePWAMaskablePNG.mockClear()
  })

  it('builds pwa files from generated blobs', async () => {
    const files = await generateAssets(undefined, baseOptions)

    expect(files.map((file) => file.name)).toEqual([
      'pwa-192x192.png',
      'pwa-512x512.png',
      'pwa-maskable-192x192.png',
      'pwa-maskable-512x512.png',
    ])
    expect(generatePWAPNG).toHaveBeenCalledWith(undefined, baseOptions, 192)
    expect(generatePWAPNG).toHaveBeenCalledWith(undefined, baseOptions, 512)
    expect(generatePWAMaskablePNG).toHaveBeenCalledWith(undefined, baseOptions, 192)
    expect(generatePWAMaskablePNG).toHaveBeenCalledWith(undefined, baseOptions, 512)
  })
})
