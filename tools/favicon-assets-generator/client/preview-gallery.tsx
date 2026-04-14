import { useBlobObjectUrl } from "./use-blob-object-url"
import {
  ChromeTabPreview,
  GoogleSearchResultPreview,
  IOSHomeScreenPreview,
  PWAAnyPreview,
  PWAMaskablePreview,
} from "./real-image-preview-surfaces"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  LayoutGrid,
  Search,
  Sparkles,
  TriangleAlert,
} from "@workspace/ui/icons"

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

function PreviewGallery({
  desktop,
  ios,
  pwa,
  site,
  sourceFile,
  sourcePreviewUrl,
}: PreviewGalleryProps) {
  const desktopPreviewUrl =
    useBlobObjectUrl(desktop.sourceFile) ?? sourcePreviewUrl
  const iosPreviewUrl = useBlobObjectUrl(ios.sourceFile) ?? sourcePreviewUrl
  const pwaAnyPreviewUrl = useBlobObjectUrl(pwa.sourceFile) ?? sourcePreviewUrl
  const pwaMaskablePreviewUrl =
    useBlobObjectUrl(pwa.maskableSourceFile) ?? sourcePreviewUrl
  const desktopUsesOriginal =
    (desktop.sourceFile?.type ?? sourceFile?.type) === "image/svg+xml" &&
    desktop.useOriginalSvg

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
            <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <span className="text-sm font-medium text-foreground">
                {faviconGeneratorCopy.searchResultLabel}
              </span>
              <GoogleSearchResultPreview
                src={desktopPreviewUrl}
                desktop={desktop}
                site={site}
                useOriginalImage={desktopUsesOriginal}
              />
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <span className="text-sm font-medium text-foreground">
                {faviconGeneratorCopy.lightTabLabel}
              </span>
              <ChromeTabPreview
                src={desktopPreviewUrl}
                desktop={desktop}
                site={site}
                useOriginalImage={desktopUsesOriginal}
              />
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <span className="text-sm font-medium text-foreground">
                {faviconGeneratorCopy.darkTabLabel}
              </span>
              <ChromeTabPreview
                dark
                src={desktopPreviewUrl}
                desktop={desktop}
                site={site}
                useOriginalImage={desktopUsesOriginal}
              />
            </div>
          </div>

          {desktopUsesOriginal ? (
            <div className="flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {faviconGeneratorCopy.darkTabSvgNoticeLabel}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <LayoutGrid className="size-4" />
            {faviconGeneratorCopy.iosPreviewTitle}
          </div>
          <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
            <span className="text-sm font-medium text-foreground">
              {faviconGeneratorCopy.iosPreviewTitle}
            </span>
            <IOSHomeScreenPreview
              src={iosPreviewUrl}
              ios={ios}
              label={site.shortName || site.name || "App"}
            />
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="size-4" />
            {faviconGeneratorCopy.pwaPreviewTitle}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <span className="text-sm font-medium text-foreground">
                {faviconGeneratorCopy.pwaAnyLabel}
              </span>
              <PWAAnyPreview src={pwaAnyPreviewUrl} pwa={pwa} />
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <span className="text-sm font-medium text-foreground">
                {faviconGeneratorCopy.pwaMaskableLabel}
              </span>
              {pwa.includeMaskable ? (
                <PWAMaskablePreview src={pwaMaskablePreviewUrl} pwa={pwa} />
              ) : (
                <div className="flex min-h-48 items-center justify-center rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-6 text-center text-sm text-muted-foreground">
                  {faviconGeneratorCopy.maskableDisabledLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PreviewGallery }
