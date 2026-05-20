"use client"

import type { IOSIconConfig } from "../core/config"
import iosBackground from "./preview-assets/ios-home-screen-background.webp"
import { PreviewTile } from "./preview-tile"
import { StyledIconOverlay } from "./styled-icon-overlay"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type IosPreviewProps = Readonly<{
  messages: FaviconMessages
  appName: string
  cfg: IOSIconConfig
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
  iosSource: ImageSource | null
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
  cfg,
  bundle,
  globalSource,
  iosSource,
}: IosPreviewProps) {
  const effectiveSource =
    cfg.useDifferentImage && iosSource ? iosSource : globalSource
  const iconUrl =
    findAssetUrl(bundle, "apple-touch-icon.png") ??
    effectiveSource?.objectUrl ??
    null

  return (
    <PreviewTile
      label={messages.previewIosHomeScreenLabel}
      chromeSrc={iosBackground.src}
      aspectRatio="1126 / 892"
    >
      <StyledIconOverlay
        src={iconUrl}
        alt={`apple-touch-icon preview for ${appName}`}
        containerStyle={{
          left: "76.7%",
          top: "69.5%",
          width: "16.2%",
          aspectRatio: "1 / 1",
        }}
        background={{ color: cfg.backgroundColor, radius: 0 }}
        marginPercent={cfg.margin}
        borderRadius="20%"
        className="shadow-md"
      />
      <div
        className="absolute truncate text-center text-white select-none"
        style={{
          top: "90.5%",
          left: "76.7%",
          width: "16.2%",
          fontSize: "2.5%",
          textShadow: "0.5px 0.5px 0.5px grey",
        }}
      >
        {appName}
      </div>
    </PreviewTile>
  )
}

export { IosPreview }
