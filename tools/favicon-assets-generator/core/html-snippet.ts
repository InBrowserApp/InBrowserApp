import type { SiteConfig } from "./config"
import { escapeHtmlAttribute } from "./escape-html"
import { normalizeAssetPath } from "./normalize-path"

type HtmlSnippetInput = Readonly<{
  site: Pick<
    SiteConfig,
    "assetPath" | "themeColor" | "enableDarkThemeColor" | "darkThemeColor"
  >
  includeVectorDesktopIcon: boolean
}>

function buildDesktopIconMarkup(assetPath: string): readonly string[] {
  const safePath = escapeHtmlAttribute(assetPath)
  return [
    `<link rel="icon" type="image/x-icon" href="${safePath}favicon.ico">`,
    `<link rel="icon" type="image/png" sizes="16x16" href="${safePath}favicon-16x16.png">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="${safePath}favicon-32x32.png">`,
  ]
}

function buildThemeColorMarkup(
  site: Pick<
    SiteConfig,
    "themeColor" | "enableDarkThemeColor" | "darkThemeColor"
  >
): readonly string[] {
  const light = escapeHtmlAttribute(site.themeColor)

  if (!site.enableDarkThemeColor) {
    return [`<meta name="theme-color" content="${light}">`]
  }

  const dark = escapeHtmlAttribute(site.darkThemeColor)
  return [
    `<meta name="theme-color" content="${light}" media="(prefers-color-scheme: light)">`,
    `<meta name="theme-color" content="${dark}" media="(prefers-color-scheme: dark)">`,
  ]
}

function buildHeadHtml({
  site,
  includeVectorDesktopIcon,
}: HtmlSnippetInput): string {
  const normalizedPath = normalizeAssetPath(site.assetPath)
  const safePath = escapeHtmlAttribute(normalizedPath)
  const desktopLines = buildDesktopIconMarkup(normalizedPath)
  const svgLine = includeVectorDesktopIcon
    ? [`<link rel="icon" type="image/svg+xml" href="${safePath}favicon.svg">`]
    : []
  const appleLine = [
    `<link rel="apple-touch-icon" href="${safePath}apple-touch-icon.png">`,
  ]
  const manifestLine = [
    `<link rel="manifest" href="${safePath}site.webmanifest">`,
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

export { buildDesktopIconMarkup, buildHeadHtml, buildThemeColorMarkup }
