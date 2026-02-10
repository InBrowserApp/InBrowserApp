import { describe, expect, it, vi } from 'vitest'

const mkdir = vi.fn()
const writeFile = vi.fn()

vi.mock('node:fs/promises', () => ({
  mkdir,
  writeFile,
  default: { mkdir, writeFile },
}))

const loadFromJiti = vi.fn()
const jitiFactory = vi.fn(() => loadFromJiti)
vi.mock('jiti', () => ({
  default: jitiFactory,
}))

type WrittenEntry = {
  url: string
  links: Array<{
    lang: string
    url: string
  }>
}

const streamState = {
  options: undefined as unknown,
  entries: [] as WrittenEntry[],
  onEnd: undefined as (() => void) | undefined,
}

class MockSitemapStream {
  constructor(options: unknown) {
    streamState.options = options
  }

  write(entry: WrittenEntry) {
    streamState.entries.push(entry)
  }

  end() {
    streamState.onEnd?.()
  }
}

const streamToPromise = vi.fn(() => {
  return new Promise<Buffer>((resolve) => {
    streamState.onEnd = () => resolve(Buffer.from('<xml/>'))
  })
})

vi.mock('sitemap', () => ({
  SitemapStream: MockSitemapStream,
  streamToPromise,
}))

describe('sitemapPlugin', () => {
  it('builds sitemap entries and writes sitemap.xml to resolved output directory', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    loadFromJiti.mockImplementation((specifier: string) => {
      if (specifier === '@registry/tools') {
        return {
          tools: [
            { path: '/tools/a' },
            { path: '/tools/a' },
            { path: '/tools/b' },
            { path: 'invalid-path' },
          ],
        }
      }

      if (specifier === '@shared/locale/languages') {
        return {
          supportedLanguages: ['en', 'zh-CN'],
        }
      }

      throw new Error(`Unexpected import: ${specifier}`)
    })

    streamState.options = undefined
    streamState.entries = []
    streamState.onEnd = undefined
    mkdir.mockReset()
    writeFile.mockReset()

    const { sitemapPlugin } = await import('./vite-plugin-sitemap')
    const plugin = sitemapPlugin()

    plugin.configResolved?.({
      root: '/tmp/app',
      build: {
        outDir: 'public',
      },
    } as Parameters<NonNullable<typeof plugin.configResolved>>[0])

    await plugin.closeBundle?.()

    expect(streamToPromise).toHaveBeenCalledTimes(1)
    expect(streamState.entries.map((entry) => entry.url)).toEqual([
      'https://inbrowser.app/',
      'https://inbrowser.app/tools',
      'https://inbrowser.app/tools/a',
      'https://inbrowser.app/tools/b',
    ])

    expect(streamState.entries[0]?.links).toEqual([
      {
        lang: 'en',
        url: 'https://inbrowser.app/en/',
      },
      {
        lang: 'zh-CN',
        url: 'https://inbrowser.app/zh-CN/',
      },
    ])

    expect(mkdir).toHaveBeenCalledWith('/tmp/app/public', { recursive: true })
    expect(writeFile).toHaveBeenCalledWith('/tmp/app/public/sitemap.xml', Buffer.from('<xml/>'))

    expect(logSpy).toHaveBeenCalledWith('Building sitemap...')
    expect(jitiFactory).toHaveBeenCalledTimes(1)

    logSpy.mockRestore()
  })

  it('falls back to the dist output directory when build outDir is missing', async () => {
    loadFromJiti.mockImplementation((specifier: string) => {
      if (specifier === '@registry/tools') {
        return {
          tools: [{ path: '/tools/c' }],
        }
      }

      return {
        supportedLanguages: ['en'],
      }
    })

    streamState.entries = []
    streamState.onEnd = undefined
    mkdir.mockReset()
    writeFile.mockReset()

    const { sitemapPlugin } = await import('./vite-plugin-sitemap')
    const plugin = sitemapPlugin()

    plugin.configResolved?.({
      root: '/tmp/default',
      build: {},
    } as Parameters<NonNullable<typeof plugin.configResolved>>[0])

    await plugin.closeBundle?.()

    expect(mkdir).toHaveBeenCalledWith('/tmp/default/dist', { recursive: true })
    expect(writeFile).toHaveBeenCalledWith('/tmp/default/dist/sitemap.xml', Buffer.from('<xml/>'))
  })
})
