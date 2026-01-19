import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import jiti from 'jiti'
import { SitemapStream, streamToPromise } from 'sitemap'
import type { Plugin } from 'vite'

const SITE_URL = 'https://inbrowser.app'

type ToolInfo = {
  path: string
}

export function sitemapPlugin(): Plugin {
  let outputDir = 'dist'

  return {
    name: 'inbrowser-sitemap',
    apply: 'build',
    configResolved(config) {
      outputDir = path.resolve(config.root, config.build.outDir || 'dist')
    },
    async closeBundle() {
      const load = jiti(import.meta.url, { interopDefault: true })
      const { tools } = load('@registry/tools') as { tools: ToolInfo[] }
      const { supportedLanguages } = load('@shared/locale/languages') as {
        supportedLanguages: string[]
      }

      const routePaths = Array.from(
        new Set(['/', '/tools', ...tools.map((tool) => tool.path)]),
      ).filter((routePath) => routePath.startsWith('/'))

      console.log('Building sitemap...')
      console.log('Tools:', tools.length)
      console.log('Languages:', supportedLanguages.length)
      console.log('Paths:', routePaths.length)

      const smStream = new SitemapStream({
        hostname: SITE_URL,
        lastmodDateOnly: false,
        xmlns: {
          news: false,
          xhtml: true,
          image: false,
          video: false,
        },
      })

      const xmlPromise = streamToPromise(smStream)

      for (const routePath of routePaths) {
        smStream.write({
          url: `${SITE_URL}${routePath}`,
          links: supportedLanguages.map((lang) => ({
            lang,
            url: `${SITE_URL}/${lang}${routePath}`,
          })),
        })
      }

      smStream.end()

      const buffer = await xmlPromise
      const outputPath = path.join(outputDir, 'sitemap.xml')

      await mkdir(outputDir, { recursive: true })
      await writeFile(outputPath, buffer)

      console.log('Sitemap generated successfully!')
      console.log('Output:', outputPath)
    },
  }
}
