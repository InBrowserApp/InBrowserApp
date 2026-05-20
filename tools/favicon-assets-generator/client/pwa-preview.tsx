"use client"

import type { PWAIconConfig } from "../core/config"
import androidLauncher from "./preview-assets/android-launcher.webp"
import windowsTaskbar from "./preview-assets/windows-taskbar.webp"
import { PreviewTile } from "./preview-tile"
import { StyledIconOverlay } from "./styled-icon-overlay"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type PwaPreviewProps = Readonly<{
  messages: FaviconMessages
  appName: string
  cfg: PWAIconConfig
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
  pwaSource: ImageSource | null
}>

function findAssetUrl(
  bundle: GeneratedBundle | null,
  filename: string
): string | null {
  return (
    bundle?.assets.find((asset) => asset.filename === filename)?.previewUrl ??
    null
  )
}

// Legacy positions, derived from windows-taskbar.webp (460x94) and
// android-launcher.webp (1080x195):
//   Windows taskbar icon slot: left 384/460 = 83.48%, top 23/94 = 24.47%,
//     width 46/460 = 10%, aspect 1:1.
//   Android launcher icon slot: left 456.125/1080 = 42.23%,
//     top 13.125/195 = 6.73%, width 168.75/1080 = 15.625%, aspect 1:1.
const WINDOWS_TASKBAR_ICON_STYLE = {
  left: `${(384 / 460) * 100}%`,
  top: `${(23 / 94) * 100}%`,
  width: `${(46 / 460) * 100}%`,
  aspectRatio: "1 / 1",
} as const
const ANDROID_LAUNCHER_ICON_STYLE = {
  left: `${(456.125 / 1080) * 100}%`,
  top: `${(13.125 / 195) * 100}%`,
  width: `${(168.75 / 1080) * 100}%`,
  aspectRatio: "1 / 1",
} as const

function PwaPreview({
  messages,
  appName,
  cfg,
  bundle,
  globalSource,
  pwaSource,
}: PwaPreviewProps) {
  const effectiveSource =
    cfg.useDifferentImage && pwaSource ? pwaSource : globalSource
  const pwa192Url =
    findAssetUrl(bundle, "pwa-192x192.png") ??
    effectiveSource?.objectUrl ??
    null
  const maskable192Url =
    findAssetUrl(bundle, "pwa-maskable-192x192.png") ??
    effectiveSource?.objectUrl ??
    null
  const anyBackground = cfg.addBackground
    ? { color: cfg.backgroundColor, radius: cfg.backgroundRadius }
    : null
  const maskableBackground = { color: cfg.maskableBackgroundColor, radius: 0 }

  return (
    <div className="flex flex-col gap-3">
      <PreviewTile
        label={messages.previewWindowsTaskbarLabel}
        chromeSrc={windowsTaskbar.src}
        aspectRatio="460 / 94"
      >
        <StyledIconOverlay
          src={pwa192Url}
          alt={`pwa-192 preview for ${appName}`}
          containerStyle={WINDOWS_TASKBAR_ICON_STYLE}
          background={anyBackground}
          marginPercent={cfg.margin}
        />
      </PreviewTile>
      {cfg.includeMaskable ? (
        <PreviewTile
          label={messages.previewAndroidLauncherLabel}
          chromeSrc={androidLauncher.src}
          aspectRatio="1080 / 195"
        >
          <StyledIconOverlay
            src={maskable192Url}
            alt={`pwa-maskable preview for ${appName}`}
            containerStyle={ANDROID_LAUNCHER_ICON_STYLE}
            background={maskableBackground}
            marginPercent={cfg.maskableMargin}
            clipPath="circle(40%)"
          />
        </PreviewTile>
      ) : null}
    </div>
  )
}

export { PwaPreview }
