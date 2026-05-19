"use client"

import windowsChromeTabDark from "./preview-assets/windows-chrome-tab-dark.webp"
import windowsChromeTab from "./preview-assets/windows-chrome-tab.webp"
import { PreviewTile } from "./preview-tile"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type DesktopPreviewProps = Readonly<{
  messages: FaviconMessages
  appName: string
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
  desktopSource: ImageSource | null
  useDifferentImage: boolean
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

function DesktopPreview({
  messages,
  appName,
  bundle,
  globalSource,
  desktopSource,
  useDifferentImage,
}: DesktopPreviewProps) {
  const fallback =
    (useDifferentImage ? desktopSource?.objectUrl : null) ??
    globalSource?.objectUrl ??
    null
  const iconUrl = findAssetUrl(bundle, "favicon-32x32.png") ?? fallback

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PreviewTile
        label={messages.previewDesktopBrowserLabel}
        chromeSrc={windowsChromeTab.src}
        aspectRatio="524 / 86"
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={`favicon-32x32 preview for ${appName}`}
            className="absolute object-contain"
            style={{
              top: `${(24 / 86) * 100}%`,
              left: `${(46 / 524) * 100}%`,
              width: `${(32 / 524) * 100}%`,
              height: `${(32 / 86) * 100}%`,
            }}
          />
        ) : null}
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
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={`favicon-32x32 preview (dark) for ${appName}`}
            className="absolute object-contain"
            style={{
              top: `${(24 / 86) * 100}%`,
              left: `${(46 / 524) * 100}%`,
              width: `${(32 / 524) * 100}%`,
              height: `${(32 / 86) * 100}%`,
            }}
          />
        ) : null}
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
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={`favicon preview for ${appName}`}
                  className="h-5 w-5 rounded-full bg-white object-contain"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-muted" />
              )}
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
