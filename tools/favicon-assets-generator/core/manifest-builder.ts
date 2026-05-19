import type { PWAIconConfig, SiteConfig } from "./config"
import { normalizeAssetPath, normalizeStartUrl } from "./normalize-path"

type ManifestIcon = Readonly<{
  src: string
  sizes: string
  type: string
  purpose: "any" | "maskable"
}>

type Manifest = Readonly<{
  name: string
  short_name: string
  description?: string
  icons: readonly ManifestIcon[]
  start_url: string
  display: string
  background_color: string
  theme_color: string
}>

type ManifestInput = Readonly<{
  site: SiteConfig
  pwa: Pick<PWAIconConfig, "includeMaskable">
}>

function buildManifestIcons(
  assetPath: string,
  includeMaskable: boolean
): readonly ManifestIcon[] {
  const icons: ManifestIcon[] = [
    {
      src: `${assetPath}pwa-192x192.png`,
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: `${assetPath}pwa-512x512.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ]

  if (includeMaskable) {
    icons.push(
      {
        src: `${assetPath}pwa-maskable-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `${assetPath}pwa-maskable-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      }
    )
  }

  return icons
}

function buildManifest({ site, pwa }: ManifestInput): Manifest {
  const assetPath = normalizeAssetPath(site.assetPath)
  const trimmedDescription = site.description.trim()
  const trimmedShortName = site.shortName.trim() || site.name

  const manifest: Manifest = {
    name: site.name,
    short_name: trimmedShortName,
    ...(trimmedDescription ? { description: trimmedDescription } : {}),
    icons: buildManifestIcons(assetPath, pwa.includeMaskable),
    start_url: normalizeStartUrl(site.startUrl),
    display: site.display,
    background_color: site.backgroundColor,
    theme_color: site.themeColor,
  }

  return manifest
}

function manifestToJsonString(manifest: Manifest): string {
  return `${JSON.stringify(manifest, null, 2)}\n`
}

export { buildManifest, buildManifestIcons, manifestToJsonString }
