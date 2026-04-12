/* v8 ignore start -- browser-only canvas and zip assembly */
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js"

import {
  calculateSquareDrawLayout,
  createHeadMarkup,
  createManifestText,
  listGeneratedAssetNames,
  shouldIncludeVectorDesktopIcon,
} from "../core/favicon-assets"
import {
  canvasToPngBlob,
  fillRoundedBackground,
  loadImageSource,
} from "./browser-image"
import { PngIcoConverter } from "./png-ico-converter"

import type {
  GenerateFaviconAssetsInput,
  GeneratedFaviconBundle,
} from "./types"
import type { LoadedImageSource } from "./browser-image"

type GeneratedBlobFile = Readonly<{
  name: string
  blob: Blob
}>

async function renderSquarePng(
  source: LoadedImageSource,
  targetSize: number,
  options: {
    margin: number
    addBackground: boolean
    backgroundColor: string
    backgroundRadius: number
  }
) {
  const canvas = document.createElement("canvas")
  canvas.width = targetSize
  canvas.height = targetSize

  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  if (options.addBackground) {
    fillRoundedBackground(
      context,
      targetSize,
      options.backgroundColor,
      options.backgroundRadius
    )
  }

  const layout = calculateSquareDrawLayout({
    sourceWidth: source.width,
    sourceHeight: source.height,
    targetSize,
    margin: options.margin,
  })

  context.drawImage(
    source.image,
    layout.x,
    layout.y,
    layout.width,
    layout.height
  )

  return canvasToPngBlob(canvas)
}

async function generateDesktopFiles(
  input: GenerateFaviconAssetsInput,
  source: LoadedImageSource
) {
  const keepVector = shouldIncludeVectorDesktopIcon(
    input.sourceFile.type,
    input.desktop
  )
  const desktopMargin =
    keepVector || input.desktop.useOriginalSvg ? 0 : input.desktop.margin
  const desktopBackground =
    keepVector || input.desktop.useOriginalSvg
      ? false
      : input.desktop.addBackground
  const renderOptions = {
    margin: desktopMargin,
    addBackground: desktopBackground,
    backgroundColor: input.desktop.backgroundColor,
    backgroundRadius: input.desktop.backgroundRadius,
  }

  const icoPngs = await Promise.all([
    renderSquarePng(source, 48, renderOptions),
    renderSquarePng(source, 32, renderOptions),
    renderSquarePng(source, 16, renderOptions),
  ])

  const converter = new PngIcoConverter()
  const faviconIco = await converter.convertToBlobAsync(
    icoPngs.map((png) => ({ png }))
  )
  const files: GeneratedBlobFile[] = [
    {
      name: "favicon.ico",
      blob: faviconIco,
    },
  ]

  if (keepVector) {
    files.push({
      name: "favicon.svg",
      blob: input.sourceFile.slice(0, input.sourceFile.size, "image/svg+xml"),
    })
    return files
  }

  const [favicon32, favicon16] = await Promise.all([
    renderSquarePng(source, 32, renderOptions),
    renderSquarePng(source, 16, renderOptions),
  ])

  files.push(
    {
      name: "favicon-32x32.png",
      blob: favicon32,
    },
    {
      name: "favicon-16x16.png",
      blob: favicon16,
    }
  )

  return files
}

async function generateIOSFile(
  input: GenerateFaviconAssetsInput,
  source: LoadedImageSource
) {
  return {
    name: "apple-touch-icon.png",
    blob: await renderSquarePng(source, 180, {
      margin: input.ios.margin,
      addBackground: true,
      backgroundColor: input.ios.backgroundColor,
      backgroundRadius: 0,
    }),
  } as const satisfies GeneratedBlobFile
}

async function generatePWAFiles(
  input: GenerateFaviconAssetsInput,
  source: LoadedImageSource
) {
  const files: GeneratedBlobFile[] = [
    {
      name: "pwa-192x192.png",
      blob: await renderSquarePng(source, 192, {
        margin: input.pwa.margin,
        addBackground: input.pwa.addBackground,
        backgroundColor: input.pwa.backgroundColor,
        backgroundRadius: input.pwa.backgroundRadius,
      }),
    },
    {
      name: "pwa-512x512.png",
      blob: await renderSquarePng(source, 512, {
        margin: input.pwa.margin,
        addBackground: input.pwa.addBackground,
        backgroundColor: input.pwa.backgroundColor,
        backgroundRadius: input.pwa.backgroundRadius,
      }),
    },
  ]

  if (input.pwa.includeMaskable) {
    files.push(
      {
        name: "pwa-maskable-192x192.png",
        blob: await renderSquarePng(source, 192, {
          margin: input.pwa.maskableMargin,
          addBackground: true,
          backgroundColor: input.pwa.maskableBackgroundColor,
          backgroundRadius: 0,
        }),
      },
      {
        name: "pwa-maskable-512x512.png",
        blob: await renderSquarePng(source, 512, {
          margin: input.pwa.maskableMargin,
          addBackground: true,
          backgroundColor: input.pwa.maskableBackgroundColor,
          backgroundRadius: 0,
        }),
      }
    )
  }

  return files
}

async function createZip(files: readonly GeneratedBlobFile[]) {
  const writer = new BlobWriter()
  const zip = new ZipWriter(writer)

  for (const file of files) {
    await zip.add(file.name, new BlobReader(file.blob))
  }

  await zip.close()

  return writer.getData()
}

async function generateFaviconAssets(
  input: GenerateFaviconAssetsInput
): Promise<GeneratedFaviconBundle> {
  const source = await loadImageSource(input.sourceFile)

  try {
    const [desktopFiles, iosFile, pwaFiles] = await Promise.all([
      generateDesktopFiles(input, source),
      generateIOSFile(input, source),
      generatePWAFiles(input, source),
    ])
    const manifestText = createManifestText(input.site, input.pwa)
    const allFiles = [
      ...desktopFiles,
      iosFile,
      ...pwaFiles,
      {
        name: "site.webmanifest",
        blob: new Blob([manifestText], {
          type: "application/manifest+json",
        }),
      },
    ] satisfies GeneratedBlobFile[]

    const zipBlob = await createZip(allFiles)

    return {
      files: listGeneratedAssetNames(
        input.sourceFile.type,
        input.desktop,
        input.pwa
      ).map((name) => {
        const file = allFiles.find((entry) => entry.name === name)

        if (!file) {
          throw new Error(`MISSING_FILE:${name}`)
        }

        return {
          name: file.name,
          size: file.blob.size,
          type: file.blob.type,
        }
      }),
      headMarkup: createHeadMarkup(
        input.sourceFile.type,
        input.site,
        input.desktop
      ),
      manifestText,
      zipBlob,
    }
  } finally {
    source.cleanup?.()
  }
}

export { generateFaviconAssets }
/* v8 ignore stop */
