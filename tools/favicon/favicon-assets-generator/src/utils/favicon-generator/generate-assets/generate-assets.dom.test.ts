import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { GenerateAssetsOptions } from './generate-assets'

const generateIOSAssets = vi.hoisted(() =>
  vi.fn(async () => [new File(['ios'], 'ios.png', { type: 'image/png' })]),
)
const generatePWAAssets = vi.hoisted(() =>
  vi.fn(async () => [new File(['pwa'], 'pwa.png', { type: 'image/png' })]),
)
const generateDesktopAssets = vi.hoisted(() =>
  vi.fn(async () => [new File(['desktop'], 'favicon.ico', { type: 'image/x-icon' })]),
)
const generateGeneralAssets = vi.hoisted(() =>
  vi.fn(async () => [
    new File(['manifest'], 'site.webmanifest', { type: 'application/manifest+json' }),
  ]),
)

const zipAddMock = vi.hoisted(() => vi.fn())
const zipCloseMock = vi.hoisted(() => vi.fn())
const zipDataBlob = new Blob(['zip'])

vi.mock('../ios-web-clip', () => ({ generateAssets: generateIOSAssets }))
vi.mock('../pwa', () => ({ generateAssets: generatePWAAssets }))
vi.mock('../desktop-browser', () => ({ generateAssets: generateDesktopAssets }))
vi.mock('../general-info', () => ({ generateAssets: generateGeneralAssets }))

vi.mock('@zip.js/zip.js', () => ({
  BlobReader: class BlobReaderMock {
    file: File

    constructor(file: File) {
      this.file = file
    }
  },
  BlobWriter: class BlobWriterMock {
    async getData() {
      return zipDataBlob
    }
  },
  ZipWriter: class ZipWriterMock {
    async add(name: string, reader: { file: File }) {
      zipAddMock(name, reader.file)
    }

    async close() {
      zipCloseMock()
    }
  },
}))

let generateAssets: typeof import('./generate-assets').generateAssets

beforeAll(async () => {
  ;({ generateAssets } = await import('./generate-assets'))
})

describe('generate assets zip', () => {
  beforeEach(() => {
    generateIOSAssets.mockClear()
    generatePWAAssets.mockClear()
    generateDesktopAssets.mockClear()
    generateGeneralAssets.mockClear()
    zipAddMock.mockClear()
    zipCloseMock.mockClear()
  })

  it('zips assets from all generators', async () => {
    const options = {
      generalInfo: {} as GenerateAssetsOptions['generalInfo'],
      desktopBrowser: {} as GenerateAssetsOptions['desktopBrowser'],
      pwa: {} as GenerateAssetsOptions['pwa'],
      iosWebClip: {} as GenerateAssetsOptions['iosWebClip'],
    }

    const result = await generateAssets(undefined, options)

    expect(generateIOSAssets).toHaveBeenCalled()
    expect(generatePWAAssets).toHaveBeenCalled()
    expect(generateDesktopAssets).toHaveBeenCalled()
    expect(generateGeneralAssets).toHaveBeenCalled()

    const names = zipAddMock.mock.calls.map(([name]) => name)
    expect(names).toEqual(['ios.png', 'pwa.png', 'favicon.ico', 'site.webmanifest'])
    expect(zipCloseMock).toHaveBeenCalled()
    expect(result).toBe(zipDataBlob)
  })
})
