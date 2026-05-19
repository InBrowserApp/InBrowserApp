type DisplayMode = "fullscreen" | "standalone" | "minimal-ui" | "browser"

type SiteConfig = Readonly<{
  name: string
  shortName: string
  description: string
  startUrl: string
  assetPath: string
  display: DisplayMode
  themeColor: string
  enableDarkThemeColor: boolean
  darkThemeColor: string
  backgroundColor: string
}>

type DesktopIconConfig = Readonly<{
  useOriginalSvg: boolean
  addBackground: boolean
  backgroundColor: string
  backgroundRadius: number
  margin: number
  useDifferentImage: boolean
}>

type IOSIconConfig = Readonly<{
  backgroundColor: string
  margin: number
  useDifferentImage: boolean
}>

type PWAIconConfig = Readonly<{
  addBackground: boolean
  backgroundColor: string
  backgroundRadius: number
  margin: number
  includeMaskable: boolean
  maskableBackgroundColor: string
  maskableMargin: number
  useDifferentImage: boolean
}>

const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: "App",
  shortName: "App",
  description: "",
  startUrl: "/",
  assetPath: "/",
  display: "standalone",
  themeColor: "#FFFFFF",
  enableDarkThemeColor: true,
  darkThemeColor: "#000000",
  backgroundColor: "#FFFFFF",
}

const DEFAULT_DESKTOP_ICON_CONFIG: DesktopIconConfig = {
  useOriginalSvg: true,
  addBackground: false,
  backgroundColor: "#FFFFFF",
  backgroundRadius: 0,
  margin: 0,
  useDifferentImage: false,
}

const DEFAULT_IOS_ICON_CONFIG: IOSIconConfig = {
  backgroundColor: "#FFFFFF",
  margin: 0,
  useDifferentImage: false,
}

const DEFAULT_PWA_ICON_CONFIG: PWAIconConfig = {
  addBackground: false,
  backgroundColor: "#FFFFFF",
  backgroundRadius: 0,
  margin: 0,
  includeMaskable: true,
  maskableBackgroundColor: "#FFFFFF",
  maskableMargin: 40,
  useDifferentImage: false,
}

export type {
  DesktopIconConfig,
  DisplayMode,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
}
export {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
  DEFAULT_SITE_CONFIG,
}
