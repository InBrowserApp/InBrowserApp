"use client"

import iosBackground from "./preview-assets/ios-home-screen-background.webp"
import { PreviewTile } from "./preview-tile"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type IosPreviewProps = Readonly<{
  messages: FaviconMessages
  appName: string
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
  iosSource: ImageSource | null
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

function IosPreview({
  messages,
  appName,
  bundle,
  globalSource,
  iosSource,
  useDifferentImage,
}: IosPreviewProps) {
  const fallback =
    (useDifferentImage ? iosSource?.objectUrl : null) ??
    globalSource?.objectUrl ??
    null
  const iconUrl = findAssetUrl(bundle, "apple-touch-icon.png") ?? fallback

  return (
    <PreviewTile
      label={messages.previewIosHomeScreenLabel}
      chromeSrc={iosBackground.src}
      aspectRatio="1126 / 892"
    >
      <div
        className="absolute overflow-hidden rounded-[20%] bg-white shadow-md"
        style={{
          left: "76.7%",
          top: "69.5%",
          width: "16.2%",
          aspectRatio: "1 / 1",
        }}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={`apple-touch-icon preview for ${appName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
    </PreviewTile>
  )
}

export { IosPreview }
