import { ImageIcon } from "@workspace/ui/icons"

import androidLauncherBackground from "./preview-assets/android-launcher.webp"
import iosHomeScreenBackground from "./preview-assets/ios-home-screen-background.webp"
import windowsChromeTabDark from "./preview-assets/windows-chrome-tab-dark.webp"
import windowsChromeTab from "./preview-assets/windows-chrome-tab.webp"
import windowsTaskbarBackground from "./preview-assets/windows-taskbar.webp"

import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
} from "../core/favicon-assets"

type SurfaceIconProps = Readonly<{
  addBackground: boolean
  backgroundColor: string
  clipPath?: string
  margin: number
  radius: number
  src: string | null
  useOriginalImage?: boolean
}>

function SurfaceIcon({
  addBackground,
  backgroundColor,
  clipPath,
  margin,
  radius,
  src,
  useOriginalImage = false,
}: SurfaceIconProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: addBackground ? backgroundColor : "transparent",
          borderRadius: addBackground ? `${radius / 2}%` : undefined,
          clipPath,
        }}
      />

      {src ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            padding: useOriginalImage ? undefined : `${margin / 2}%`,
            clipPath,
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/70">
          <ImageIcon className="size-6" />
        </div>
      )}
    </div>
  )
}

type GoogleSearchResultPreviewProps = Readonly<{
  desktop: DesktopIconConfig
  site: SiteConfig
  src: string | null
  useOriginalImage: boolean
}>

function GoogleSearchResultPreview({
  desktop,
  site,
  src,
  useOriginalImage,
}: GoogleSearchResultPreviewProps) {
  return (
    <div
      data-testid="google-search-result-preview"
      className="rounded-[1.75rem] border border-border/70 bg-background px-5 pt-3 pb-5"
    >
      <div className="mb-3 text-[22px] leading-[1.3] text-[#1a0dab] dark:text-[#8ab4f8]">
        {site.name || "App"}
      </div>

      <div className="flex items-center gap-3">
        <div className="size-[26px] rounded-full border border-[#ecedef] bg-[#f1f3f4] p-1 dark:border-[#3c4043] dark:bg-white">
          <SurfaceIcon
            src={src}
            addBackground={!useOriginalImage && desktop.addBackground}
            backgroundColor={desktop.backgroundColor}
            margin={useOriginalImage ? 0 : desktop.margin}
            radius={desktop.backgroundRadius}
            useOriginalImage={useOriginalImage}
          />
        </div>

        <div className="min-w-0">
          <div className="truncate text-[14px] leading-5 text-[#202124] dark:text-[#dadce0]">
            {site.name || "App"}
          </div>
          <div className="truncate text-[12px] leading-[18px] text-[#006621] dark:text-[#bdc1c6]">
            {site.startUrl || "https://example.com"}
          </div>
        </div>
      </div>

      <div className="mt-3 text-[13px] leading-5 text-muted-foreground">
        {site.description || "Website favicon preview"}
      </div>
    </div>
  )
}

type ChromeTabPreviewProps = Readonly<{
  dark?: boolean
  desktop: DesktopIconConfig
  site: SiteConfig
  src: string | null
  useOriginalImage: boolean
}>

function ChromeTabPreview({
  dark = false,
  desktop,
  site,
  src,
  useOriginalImage,
}: ChromeTabPreviewProps) {
  return (
    <div
      data-testid={
        dark ? "desktop-dark-tab-preview" : "desktop-light-tab-preview"
      }
      className="relative aspect-[524/86] w-full"
    >
      <img
        src={dark ? windowsChromeTabDark : windowsChromeTab}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute top-[27.9%] left-[8.78%] h-[37.2%] w-[6.11%]">
        <SurfaceIcon
          src={src}
          addBackground={!useOriginalImage && desktop.addBackground}
          backgroundColor={desktop.backgroundColor}
          margin={useOriginalImage ? 0 : desktop.margin}
          radius={desktop.backgroundRadius}
          useOriginalImage={useOriginalImage}
        />
      </div>

      <div
        className="absolute top-[23.25%] left-[17.94%] max-w-[65%] truncate overflow-hidden text-[clamp(0.6rem,1.2vw,1rem)]"
        style={{
          color: dark ? "#ffffff" : "#000000",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {site.name || "App"}
      </div>
    </div>
  )
}

type IOSHomeScreenPreviewProps = Readonly<{
  ios: IOSIconConfig
  label: string
  src: string | null
}>

function IOSHomeScreenPreview({ ios, label, src }: IOSHomeScreenPreviewProps) {
  return (
    <div
      data-testid="ios-home-screen-preview"
      className="relative aspect-[1126/892] w-full overflow-hidden rounded-[1.75rem]"
    >
      <img
        src={iosHomeScreenBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute top-[69.5%] left-[76.7%] aspect-square w-[16.2%] overflow-hidden rounded-[20%]">
        <SurfaceIcon
          src={src}
          addBackground
          backgroundColor={ios.backgroundColor}
          margin={ios.margin}
          radius={0}
        />
      </div>

      <div className="absolute top-[90.5%] left-[76.7%] w-[16.2%] truncate text-center text-[clamp(0.55rem,1vw,0.95rem)] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
        {label || "App"}
      </div>
    </div>
  )
}

type PWAAnyPreviewProps = Readonly<{
  pwa: PWAIconConfig
  src: string | null
}>

function PWAAnyPreview({ pwa, src }: PWAAnyPreviewProps) {
  return (
    <div
      data-testid="pwa-any-preview"
      className="relative aspect-[460/94] w-full overflow-hidden rounded-[1.75rem]"
    >
      <img
        src={windowsTaskbarBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute top-[24.47%] left-[83.48%] aspect-square w-[10%] overflow-hidden">
        <SurfaceIcon
          src={src}
          addBackground={pwa.addBackground}
          backgroundColor={pwa.backgroundColor}
          margin={pwa.margin}
          radius={pwa.backgroundRadius}
        />
      </div>
    </div>
  )
}

type PWAMaskablePreviewProps = Readonly<{
  pwa: PWAIconConfig
  src: string | null
}>

function PWAMaskablePreview({ pwa, src }: PWAMaskablePreviewProps) {
  return (
    <div
      data-testid="pwa-maskable-preview"
      className="relative aspect-[1080/195] w-full overflow-hidden rounded-[1.75rem]"
    >
      <img
        src={androidLauncherBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute top-[6.73%] left-[42.24%] aspect-square w-[15.63%] overflow-hidden">
        <SurfaceIcon
          src={src}
          addBackground
          backgroundColor={pwa.maskableBackgroundColor}
          clipPath="circle(40%)"
          margin={pwa.maskableMargin}
          radius={0}
        />
      </div>
    </div>
  )
}

export {
  ChromeTabPreview,
  GoogleSearchResultPreview,
  IOSHomeScreenPreview,
  PWAAnyPreview,
  PWAMaskablePreview,
}
