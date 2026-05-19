import type { SiteConfig } from "./config"
import { normalizeAssetPath } from "./normalize-path"

type HtmlSnippetInput = Readonly<{
  site: Pick<
    SiteConfig,
    "assetPath" | "themeColor" | "enableDarkThemeColor" | "darkThemeColor"
  >
  includeVectorDesktopIcon: boolean
}>

function buildDesktopIconMarkup(assetPath: string): readonly string[] {
  return [
    `<link rel="icon" type="image/x-icon" href="${assetPath}favicon.ico">`,
    `<link rel="icon" type="image/png" sizes="16x16" href="${assetPath}favicon-16x16.png">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="${assetPath}favicon-32x32.png">`,
  ]
}

function buildThemeColorMarkup(
  site: Pick<
    SiteConfig,
    "themeColor" | "enableDarkThemeColor" | "darkThemeColor"
  >
): readonly string[] {
  if (!site.enableDarkThemeColor) {
    return [`<meta name="theme-color" content="${site.themeColor}">`]
  }

  return [
    `<meta name="theme-color" content="${site.themeColor}" media="(prefers-color-scheme: light)">`,
    `<meta name="theme-color" content="${site.darkThemeColor}" media="(prefers-color-scheme: dark)">`,
  ]
}

function buildHeadHtml({
  site,
  includeVectorDesktopIcon,
}: HtmlSnippetInput): string {
  const assetPath = normalizeAssetPath(site.assetPath)
  const desktopLines = buildDesktopIconMarkup(assetPath)
  const svgLine = includeVectorDesktopIcon
    ? [`<link rel="icon" type="image/svg+xml" href="${assetPath}favicon.svg">`]
    : []
  const appleLine = [
    `<link rel="apple-touch-icon" href="${assetPath}apple-touch-icon.png">`,
  ]
  const manifestLine = [
    `<link rel="manifest" href="${assetPath}site.webmanifest">`,
  ]
  const themeLines = buildThemeColorMarkup(site)

  return [
    ...desktopLines,
    ...svgLine,
    ...appleLine,
    ...manifestLine,
    ...themeLines,
  ].join("\n")
}

export type { HtmlSnippetInput }
export { buildDesktopIconMarkup, buildHeadHtml, buildThemeColorMarkup }
