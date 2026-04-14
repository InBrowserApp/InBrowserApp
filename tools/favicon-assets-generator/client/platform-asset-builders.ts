/* v8 ignore start -- browser-only canvas rendering helpers */
import {
  calculateSquareDrawLayout,
  createDesktopHeadMarkup,
  createIOSHeadMarkup,
  createManifestIconsText,
  shouldIncludeVectorDesktopIcon,
} from "../core/favicon-assets"
import {
  canvasToPngBlob,
  fillRoundedBackground,
  loadImageSource,
} from "./browser-image"
import { PngIcoConverter } from "./png-ico-converter"

import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
} from "../core/favicon-assets"
import type {
  GenerateFaviconAssetsInput,
  GeneratedAssetGroup,
  GeneratedBlobFile,
} from "./types"
import type { LoadedImageSource } from "./browser-image"

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

async function withLoadedSource<T>(
  sourceFile: File,
  callback: (source: LoadedImageSource) => Promise<T>
) {
  const source = await loadImageSource(sourceFile)

  try {
    return await callback(source)
  } finally {
    source.cleanup?.()
  }
}

function resolveDesktopSourceFile(input: GenerateFaviconAssetsInput) {
  return input.desktop.sourceFile ?? input.sourceFile
}

async function generateDesktopFiles(
  sourceFile: File,
  desktop: DesktopIconConfig
) {
  return withLoadedSource(sourceFile, async (source) => {
    const keepVector = shouldIncludeVectorDesktopIcon(sourceFile.type, desktop)
    const desktopMargin =
      keepVector || desktop.useOriginalSvg ? 0 : desktop.margin
    const desktopBackground =
      keepVector || desktop.useOriginalSvg ? false : desktop.addBackground
    const renderOptions = {
      margin: desktopMargin,
      addBackground: desktopBackground,
      backgroundColor: desktop.backgroundColor,
      backgroundRadius: desktop.backgroundRadius,
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
        blob: sourceFile.slice(0, sourceFile.size, "image/svg+xml"),
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
  })
}

async function generateIOSFile(sourceFile: File, ios: IOSIconConfig) {
  return withLoadedSource(sourceFile, async (source) => ({
    name: "apple-touch-icon.png",
    blob: await renderSquarePng(source, 180, {
      margin: ios.margin,
      addBackground: true,
      backgroundColor: ios.backgroundColor,
      backgroundRadius: 0,
    }),
  }))
}

async function generatePWAAnyFiles(sourceFile: File, pwa: PWAIconConfig) {
  return withLoadedSource(
    sourceFile,
    async (source) =>
      [
        {
          name: "pwa-192x192.png",
          blob: await renderSquarePng(source, 192, {
            margin: pwa.margin,
            addBackground: pwa.addBackground,
            backgroundColor: pwa.backgroundColor,
            backgroundRadius: pwa.backgroundRadius,
          }),
        },
        {
          name: "pwa-512x512.png",
          blob: await renderSquarePng(source, 512, {
            margin: pwa.margin,
            addBackground: pwa.addBackground,
            backgroundColor: pwa.backgroundColor,
            backgroundRadius: pwa.backgroundRadius,
          }),
        },
      ] satisfies readonly GeneratedBlobFile[]
  )
}

async function generatePWAMaskableFiles(sourceFile: File, pwa: PWAIconConfig) {
  if (!pwa.includeMaskable) {
    return [] as const satisfies readonly GeneratedBlobFile[]
  }

  return withLoadedSource(
    sourceFile,
    async (source) =>
      [
        {
          name: "pwa-maskable-192x192.png",
          blob: await renderSquarePng(source, 192, {
            margin: pwa.maskableMargin,
            addBackground: true,
            backgroundColor: pwa.maskableBackgroundColor,
            backgroundRadius: 0,
          }),
        },
        {
          name: "pwa-maskable-512x512.png",
          blob: await renderSquarePng(source, 512, {
            margin: pwa.maskableMargin,
            addBackground: true,
            backgroundColor: pwa.maskableBackgroundColor,
            backgroundRadius: 0,
          }),
        },
      ] satisfies readonly GeneratedBlobFile[]
  )
}

async function generateDesktopAssetGroup(
  input: Pick<GenerateFaviconAssetsInput, "desktop" | "site" | "sourceFile">
) {
  const desktopSourceFile = input.desktop.sourceFile ?? input.sourceFile

  return {
    files: await generateDesktopFiles(desktopSourceFile, input.desktop),
    snippetText: createDesktopHeadMarkup(
      desktopSourceFile.type,
      input.site,
      input.desktop
    ),
  } as const satisfies GeneratedAssetGroup
}

async function generateIOSAssetGroup(
  input: Pick<GenerateFaviconAssetsInput, "ios" | "site" | "sourceFile">
) {
  const iosSourceFile = input.ios.sourceFile ?? input.sourceFile

  return {
    files: [await generateIOSFile(iosSourceFile, input.ios)],
    snippetText: createIOSHeadMarkup(input.site),
  } as const satisfies GeneratedAssetGroup
}

async function generatePWAAnyAssetGroup(
  input: Pick<GenerateFaviconAssetsInput, "pwa" | "site" | "sourceFile">
) {
  const pwaSourceFile = input.pwa.sourceFile ?? input.sourceFile

  return {
    files: await generatePWAAnyFiles(pwaSourceFile, input.pwa),
    snippetText: createManifestIconsText(input.site, input.pwa, "any"),
  } as const satisfies GeneratedAssetGroup
}

async function generatePWAMaskableAssetGroup(
  input: Pick<GenerateFaviconAssetsInput, "pwa" | "site" | "sourceFile">
) {
  if (!input.pwa.includeMaskable) {
    return null
  }

  const maskableSourceFile = input.pwa.maskableSourceFile ?? input.sourceFile

  return {
    files: await generatePWAMaskableFiles(maskableSourceFile, input.pwa),
    snippetText: createManifestIconsText(input.site, input.pwa, "maskable"),
  } as const satisfies GeneratedAssetGroup
}

export {
  generateDesktopAssetGroup,
  generateIOSAssetGroup,
  generatePWAAnyAssetGroup,
  generatePWAMaskableAssetGroup,
  resolveDesktopSourceFile,
}
/* v8 ignore stop */
