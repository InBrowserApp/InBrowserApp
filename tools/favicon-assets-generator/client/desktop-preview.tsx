"use client"

import type { DesktopIconConfig } from "../core/config"
import windowsChromeTabDark from "./preview-assets/windows-chrome-tab-dark.webp"
import windowsChromeTab from "./preview-assets/windows-chrome-tab.webp"
import { PreviewTile } from "./preview-tile"
import { StyledIconOverlay } from "./styled-icon-overlay"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type DesktopPreviewProps = Readonly<{
  messages: FaviconMessages
  appName: string
  cfg: DesktopIconConfig
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
  desktopSource: ImageSource | null
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

const ICON_TOP = `${(24 / 86) * 100}%`
const ICON_LEFT = `${(46 / 524) * 100}%`
const ICON_WIDTH = `${(32 / 524) * 100}%`
const ICON_HEIGHT = `${(32 / 86) * 100}%`

function DesktopPreview({
  messages,
  appName,
  cfg,
  bundle,
  globalSource,
  desktopSource,
}: DesktopPreviewProps) {
  const effectiveSource =
    cfg.useDifferentImage && desktopSource ? desktopSource : globalSource
  const iconUrl =
    findAssetUrl(bundle, "favicon-32x32.png") ??
    effectiveSource?.objectUrl ??
    null
  const background = cfg.addBackground
    ? { color: cfg.backgroundColor, radius: cfg.backgroundRadius }
    : null

  const overlayContainerStyle = {
    top: ICON_TOP,
    left: ICON_LEFT,
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PreviewTile
        label={messages.previewDesktopBrowserLabel}
        chromeSrc={windowsChromeTab.src}
        aspectRatio="524 / 86"
      >
        <StyledIconOverlay
          src={iconUrl}
          alt={`favicon preview for ${appName}`}
          containerStyle={overlayContainerStyle}
          background={background}
          marginPercent={cfg.margin}
        />
        <div
          className="absolute truncate text-[10px] font-medium text-neutral-900 select-none"
          style={{
            top: `${(28 / 86) * 100}%`,
            left: `${(86 / 524) * 100}%`,
            maxWidth: "60%",
          }}
        >
          {appName}
        </div>
      </PreviewTile>
      <PreviewTile
        label={`${messages.previewDesktopBrowserLabel} (dark)`}
        chromeSrc={windowsChromeTabDark.src}
        aspectRatio="524 / 86"
      >
        <StyledIconOverlay
          src={iconUrl}
          alt={`favicon preview (dark) for ${appName}`}
          containerStyle={overlayContainerStyle}
          background={background}
          marginPercent={cfg.margin}
        />
        <div
          className="absolute truncate text-[10px] font-medium text-white select-none"
          style={{
            top: `${(28 / 86) * 100}%`,
            left: `${(86 / 524) * 100}%`,
            maxWidth: "60%",
          }}
        >
          {appName}
        </div>
      </PreviewTile>
      <div className="sm:col-span-2">
        <PreviewTile
          label={messages.previewGoogleSearchLabel}
          aspectRatio="524 / 140"
          className="bg-white"
        >
          <div className="absolute inset-0 flex flex-col items-start justify-center px-4 text-left">
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white">
                <StyledIconOverlay
                  src={iconUrl}
                  alt={`favicon preview for ${appName}`}
                  containerStyle={{ inset: 0 }}
                  background={background}
                  marginPercent={cfg.margin}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-neutral-700">
                  {appName} · example.com
                </span>
              </div>
            </div>
            <span className="mt-1 text-base leading-tight font-medium text-[#1a0dab]">
              {appName} — site title
            </span>
            <span className="mt-0.5 text-[11px] text-neutral-600">
              Search engine snippet preview powered by your favicon.
            </span>
          </div>
        </PreviewTile>
      </div>
    </div>
  )
}

export { DesktopPreview }
