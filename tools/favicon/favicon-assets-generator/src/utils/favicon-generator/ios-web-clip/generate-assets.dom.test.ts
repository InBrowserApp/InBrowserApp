import { describe, expect, it, vi } from 'vitest'
import type { iOSWebClipOptions } from './types'

vi.mock('./generate-output', () => ({
  generateOutput: vi.fn(),
}))

import { generateAssets } from './generate-assets'
import { generateOutput } from './generate-output'

const generateOutputMock = vi.mocked(generateOutput)

describe('generateAssets', () => {
  it('creates an apple touch icon file from generated output', async () => {
    const image = new Blob(['input'], { type: 'image/png' })
    const options: iOSWebClipOptions = {
      backgroundColor: '#ffffff',
      margin: 20,
    }

    generateOutputMock.mockResolvedValueOnce(new Blob(['ios-output'], { type: 'image/png' }))

    const files = await generateAssets(image, options)

    expect(generateOutputMock).toHaveBeenCalledWith(image, options)
    expect(files).toHaveLength(1)

    const [file] = files
    expect(file).toBeInstanceOf(File)
    expect(file?.name).toBe('apple-touch-icon.png')
    expect(file?.type).toBe('image/png')
    await expect(file?.text()).resolves.toBe('ios-output')
  })
})
