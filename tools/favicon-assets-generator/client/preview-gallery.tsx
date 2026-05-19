"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { LayoutGrid } from "@workspace/ui/icons"

import androidLauncherUrl from "./preview-assets/android-launcher.webp"
import iosBackgroundUrl from "./preview-assets/ios-home-screen-background.webp"
import windowsChromeTabDarkUrl from "./preview-assets/windows-chrome-tab-dark.webp"
import windowsChromeTabUrl from "./preview-assets/windows-chrome-tab.webp"
import windowsTaskbarUrl from "./preview-assets/windows-taskbar.webp"
import { PreviewTile } from "./preview-tile"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type PreviewGalleryProps = Readonly<{
  messages: FaviconMessages
  appName: string
  themeColor: string
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
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

function PreviewGallery({
  messages,
  appName,
  themeColor,
  bundle,
  globalSource,
}: PreviewGalleryProps) {
  if (!bundle && !globalSource) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{messages.previewGalleryTitle}</CardTitle>
          <CardDescription>
            {messages.previewGalleryDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="border border-dashed border-border/80 bg-muted/30">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LayoutGrid />
              </EmptyMedia>
              <EmptyTitle>{messages.previewBeforeGenerateHint}</EmptyTitle>
              <EmptyDescription>
                {messages.previewGalleryDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const fallbackUrl = globalSource?.objectUrl ?? null
  const desktopIconUrl =
    findAssetUrl(bundle, "favicon-32x32.png") ?? fallbackUrl
  const appleTouchUrl =
    findAssetUrl(bundle, "apple-touch-icon.png") ?? fallbackUrl
  const pwa192Url = findAssetUrl(bundle, "pwa-192x192.png") ?? fallbackUrl
  const maskable192Url =
    findAssetUrl(bundle, "pwa-maskable-192x192.png") ??
    findAssetUrl(bundle, "pwa-192x192.png") ??
    fallbackUrl

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.previewGalleryTitle}</CardTitle>
        <CardDescription>
          {bundle
            ? messages.previewGalleryDescription
            : messages.previewBeforeGenerateHint}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <PreviewTile
            label={messages.previewDesktopBrowserLabel}
            chromeSrc={windowsChromeTabUrl}
            aspectRatio="524 / 86"
          >
            {desktopIconUrl ? (
              <img
                src={desktopIconUrl}
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
              className="absolute text-[10px] font-medium select-none"
              style={{
                top: `${(28 / 86) * 100}%`,
                left: `${(86 / 524) * 100}%`,
                color: "#111",
              }}
            >
              {appName}
            </div>
          </PreviewTile>

          <PreviewTile
            label={messages.previewGoogleSearchLabel}
            aspectRatio="524 / 200"
            className="bg-white"
          >
            <div className="absolute inset-0 flex flex-col items-start justify-center p-4 text-left">
              <div className="flex items-center gap-2">
                {desktopIconUrl ? (
                  <img
                    src={desktopIconUrl}
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
                Search snippet preview powered by your favicon.
              </span>
            </div>
          </PreviewTile>

          <PreviewTile
            label={messages.previewIosHomeScreenLabel}
            chromeSrc={iosBackgroundUrl}
            aspectRatio="1126 / 892"
          >
            {appleTouchUrl ? (
              <div
                className="absolute overflow-hidden rounded-[20%] bg-white shadow-md"
                style={{
                  left: "76.7%",
                  top: "69.5%",
                  width: "16.2%",
                  aspectRatio: "1 / 1",
                }}
              >
                <img
                  src={appleTouchUrl}
                  alt={`apple-touch-icon preview for ${appName}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </PreviewTile>

          <PreviewTile
            label={messages.previewAndroidLauncherLabel}
            chromeSrc={androidLauncherUrl}
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

          <PreviewTile
            label={messages.previewWindowsTaskbarLabel}
            chromeSrc={windowsTaskbarUrl}
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

          <PreviewTile
            label={messages.previewDesktopBrowserLabel}
            chromeSrc={windowsChromeTabDarkUrl}
            aspectRatio="524 / 86"
            className="bg-neutral-900 text-white"
          >
            {desktopIconUrl ? (
              <img
                src={desktopIconUrl}
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
              className="absolute text-[10px] font-medium select-none"
              style={{
                top: `${(28 / 86) * 100}%`,
                left: `${(86 / 524) * 100}%`,
                color: themeColor,
              }}
            >
              {appName}
            </div>
          </PreviewTile>
        </div>
      </CardContent>
    </Card>
  )
}

export { PreviewGallery }
