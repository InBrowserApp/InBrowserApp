import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { ImageIcon, LayoutGrid, Search, Sparkles } from "@workspace/ui/icons"

import { faviconGeneratorCopy } from "./copy"

import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
} from "../core/favicon-assets"

type PreviewGalleryProps = Readonly<{
  desktop: DesktopIconConfig
  ios: IOSIconConfig
  pwa: PWAIconConfig
  site: SiteConfig
  sourceFile: File | null
  sourcePreviewUrl: string | null
}>

type IconPreviewProps = Readonly<{
  addBackground: boolean
  backgroundColor: string
  margin: number
  radius: number
  src: string | null
}>

function IconPreview({
  addBackground,
  backgroundColor,
  margin,
  radius,
  src,
}: IconPreviewProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[22%] border border-border/70 bg-background/80">
      {addBackground ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor,
            borderRadius: `${radius / 2}%`,
          }}
        />
      ) : null}
      {src ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          style={{ padding: `${margin / 2}%` }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <ImageIcon className="size-8" />
        </div>
      )}
    </div>
  )
}

function PreviewTile(props: { children: ReactNode; label: string }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
      <span className="text-sm font-medium text-foreground">{props.label}</span>
      {props.children}
    </div>
  )
}

function PreviewGallery({
  desktop,
  ios,
  pwa,
  site,
  sourceFile,
  sourcePreviewUrl,
}: PreviewGalleryProps) {
  const desktopUsesOriginal =
    sourceFile?.type === "image/svg+xml" && desktop.useOriginalSvg
  const desktopAddBackground = desktopUsesOriginal
    ? false
    : desktop.addBackground
  const desktopMargin = desktopUsesOriginal ? 0 : desktop.margin

  return (
    <Card>
      <CardHeader>
        <CardTitle>{faviconGeneratorCopy.previewTitle}</CardTitle>
        <CardDescription>
          {faviconGeneratorCopy.previewDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-2">
        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Search className="size-4" />
            {faviconGeneratorCopy.desktopPreviewTitle}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <PreviewTile label={faviconGeneratorCopy.searchResultLabel}>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 shrink-0">
                    <IconPreview
                      src={sourcePreviewUrl}
                      addBackground={desktopAddBackground}
                      backgroundColor={desktop.backgroundColor}
                      margin={desktopMargin}
                      radius={desktop.backgroundRadius}
                    />
                  </div>
                  <div className="grid gap-1">
                    <div className="text-sm font-medium text-foreground">
                      {site.name || "App"}
                    </div>
                    <div className="text-xs text-emerald-700">
                      {site.startUrl || "/"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {site.description || "Website favicon preview"}
                    </div>
                  </div>
                </div>
              </div>
            </PreviewTile>

            <PreviewTile label={faviconGeneratorCopy.lightTabLabel}>
              <div className="rounded-2xl border border-border bg-background p-2 shadow-sm">
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-3 py-2">
                  <div className="w-6 shrink-0">
                    <IconPreview
                      src={sourcePreviewUrl}
                      addBackground={desktopAddBackground}
                      backgroundColor={desktop.backgroundColor}
                      margin={desktopMargin}
                      radius={desktop.backgroundRadius}
                    />
                  </div>
                  <span className="truncate text-xs font-medium text-foreground">
                    {site.name || "App"}
                  </span>
                </div>
              </div>
            </PreviewTile>

            <PreviewTile label={faviconGeneratorCopy.darkTabLabel}>
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-2 shadow-sm">
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
                  <div className="w-6 shrink-0">
                    <IconPreview
                      src={sourcePreviewUrl}
                      addBackground={desktopAddBackground}
                      backgroundColor={desktop.backgroundColor}
                      margin={desktopMargin}
                      radius={desktop.backgroundRadius}
                    />
                  </div>
                  <span className="truncate text-xs font-medium text-slate-100">
                    {site.name || "App"}
                  </span>
                </div>
              </div>
            </PreviewTile>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <LayoutGrid className="size-4" />
            {faviconGeneratorCopy.iosPreviewTitle}
          </div>
          <PreviewTile label={faviconGeneratorCopy.iosPreviewTitle}>
            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#1d3557_0%,#2a9d8f_45%,#f4a261_100%)] p-6">
              <div className="ml-auto grid w-24 gap-2 text-center">
                <IconPreview
                  src={sourcePreviewUrl}
                  addBackground
                  backgroundColor={ios.backgroundColor}
                  margin={ios.margin}
                  radius={20}
                />
                <span className="truncate text-xs font-medium text-white">
                  {site.shortName || site.name || "App"}
                </span>
              </div>
            </div>
          </PreviewTile>

          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="size-4" />
            {faviconGeneratorCopy.pwaPreviewTitle}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <PreviewTile label={faviconGeneratorCopy.pwaAnyLabel}>
              <div className="rounded-[1.75rem] border border-border/70 bg-background p-5">
                <div className="mb-6 flex justify-center">
                  <div className="w-24">
                    <IconPreview
                      src={sourcePreviewUrl}
                      addBackground={pwa.addBackground}
                      backgroundColor={pwa.backgroundColor}
                      margin={pwa.margin}
                      radius={pwa.backgroundRadius}
                    />
                  </div>
                </div>
                <div className="rounded-full bg-slate-900 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 shrink-0">
                      <IconPreview
                        src={sourcePreviewUrl}
                        addBackground={pwa.addBackground}
                        backgroundColor={pwa.backgroundColor}
                        margin={pwa.margin}
                        radius={pwa.backgroundRadius}
                      />
                    </div>
                    <span className="truncate text-xs font-medium text-slate-100">
                      {site.shortName || site.name || "App"}
                    </span>
                  </div>
                </div>
              </div>
            </PreviewTile>

            <PreviewTile label={faviconGeneratorCopy.pwaMaskableLabel}>
              {pwa.includeMaskable ? (
                <div className="rounded-[1.75rem] bg-[radial-gradient(circle_at_top,#f8fafc_0%,#dbeafe_42%,#bfdbfe_100%)] p-5">
                  <div className="mx-auto grid w-28 gap-3 text-center">
                    <div className="rounded-[30%] bg-white/95 p-3 shadow-sm">
                      <IconPreview
                        src={sourcePreviewUrl}
                        addBackground
                        backgroundColor={pwa.maskableBackgroundColor}
                        margin={pwa.maskableMargin}
                        radius={0}
                      />
                    </div>
                    <span className="truncate text-xs font-medium text-slate-900">
                      {site.shortName || site.name || "App"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-48 items-center justify-center rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-6 text-center text-sm text-muted-foreground">
                  {faviconGeneratorCopy.maskableDisabledLabel}
                </div>
              )}
            </PreviewTile>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PreviewGallery }
