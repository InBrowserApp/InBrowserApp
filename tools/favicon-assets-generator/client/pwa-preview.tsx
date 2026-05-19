"use client"

import androidLauncher from "./preview-assets/android-launcher.webp"
import windowsTaskbar from "./preview-assets/windows-taskbar.webp"
import { PreviewTile } from "./preview-tile"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type PwaPreviewProps = Readonly<{
  messages: FaviconMessages
  appName: string
  includeMaskable: boolean
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
  pwaSource: ImageSource | null
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

function PwaPreview({
  messages,
  appName,
  includeMaskable,
  bundle,
  globalSource,
  pwaSource,
  useDifferentImage,
}: PwaPreviewProps) {
  const fallback =
    (useDifferentImage ? pwaSource?.objectUrl : null) ??
    globalSource?.objectUrl ??
    null
  const pwa192Url = findAssetUrl(bundle, "pwa-192x192.png") ?? fallback
  const maskable192Url =
    findAssetUrl(bundle, "pwa-maskable-192x192.png") ??
    findAssetUrl(bundle, "pwa-192x192.png") ??
    fallback

  return (
    <div className="flex flex-col gap-3">
      <PreviewTile
        label={messages.previewWindowsTaskbarLabel}
        chromeSrc={windowsTaskbar.src}
        aspectRatio="460 / 94"
      >
        {pwa192Url ? (
          <img
            src={pwa192Url}
            alt={`pwa-192 preview for ${appName}`}
            className="absolute object-contain"
            style={{
              top: "20%",
              left: "calc(50% - 7%)",
              width: "14%",
              height: "60%",
            }}
          />
        ) : null}
      </PreviewTile>
      {includeMaskable ? (
        <PreviewTile
          label={messages.previewAndroidLauncherLabel}
          chromeSrc={androidLauncher.src}
          aspectRatio="1080 / 195"
        >
          {maskable192Url ? (
            <div
              className="absolute overflow-hidden rounded-full bg-white shadow"
              style={{
                left: "calc(50% - 9%)",
                top: "8%",
                width: "18%",
                aspectRatio: "1 / 1",
              }}
            >
              <img
                src={maskable192Url}
                alt={`pwa-maskable preview for ${appName}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </PreviewTile>
      ) : null}
    </div>
  )
}

export { PwaPreview }
