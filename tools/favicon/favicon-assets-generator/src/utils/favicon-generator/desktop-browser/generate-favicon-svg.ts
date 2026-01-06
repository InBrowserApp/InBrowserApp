import type { DesktopBrowserOptions } from './types'

export async function generateFaviconSVG(
  blob: Blob,
  options: DesktopBrowserOptions,
): Promise<Blob> {
  // TODO: svgo will break css media queries
  // https://github.com/svg/svgo/issues/1834
  const svgo = import('svgo/browser')

  const image = options?.image ?? blob
  if (image === undefined) {
    throw new Error('image is undefined')
  }

  if (image.type !== 'image/svg+xml') {
    throw new Error('image is not svg')
  }

  const svgString = await image.text()

  const optimize = (await svgo).optimize
  const result = optimize(svgString, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // customize default plugin options
            inlineStyles: false,
          },
        },
      },
    ],
  })

  const newBlob = new Blob([result.data], {
    type: 'image/svg+xml',
  })

  return newBlob
}
