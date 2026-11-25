const INSTALL_GROUPS = ["ios", "android", "desktop"] as const

type InstallGroup = (typeof INSTALL_GROUPS)[number]
type GuideInfo = {
  group: InstallGroup
  browser: string | null
  links: readonly { label: string; href: string }[]
  fallback?: string
}

const INSTALL_GUIDES = {
  "ios-safari": {
    group: "ios",
    browser: "Safari",
    links: [
      {
        label: "iPhone",
        href: "https://support.apple.com/en-us/guide/iphone/iphea86e5236/ios",
      },
      {
        label: "iPad",
        href: "https://support.apple.com/en-ca/guide/ipad/ipad8f1f7a29/ipados",
      },
    ],
  },
  "ios-other": {
    group: "ios",
    browser: null,
    fallback: "ios-safari",
    links: [
      {
        label: "Chrome",
        href: "https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DiOS",
      },
      {
        label: "Firefox",
        href: "https://support.mozilla.org/kb/add-website-shortcut-your-home-screen-ios",
      },
    ],
  },
  "android-chrome": {
    group: "android",
    browser: "Chrome",
    links: [
      {
        label: "Chrome",
        href: "https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid",
      },
    ],
  },
  "android-firefox": {
    group: "android",
    browser: "Firefox",
    links: [
      {
        label: "Firefox",
        href: "https://support.mozilla.org/kb/use-web-apps-firefox-android",
      },
    ],
  },
  "android-samsung-internet": {
    group: "android",
    browser: "Samsung Internet",
    links: [
      {
        label: "Samsung Internet",
        href: "https://developer.samsung.com/browser/android/web-developer-guide.html",
      },
    ],
  },
  "android-other": {
    group: "android",
    browser: null,
    fallback: "android-chrome",
    links: [
      {
        label: "Chrome",
        href: "https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid",
      },
    ],
  },
  "desktop-chrome": {
    group: "desktop",
    browser: "Chrome",
    links: [
      {
        label: "Chrome",
        href: "https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DDesktop",
      },
    ],
  },
  "desktop-edge": {
    group: "desktop",
    browser: "Microsoft Edge",
    links: [
      {
        label: "Microsoft Edge",
        href: "https://support.microsoft.com/en-us/edge/install-manage-or-uninstall-apps-in-microsoft-edge",
      },
    ],
  },
  "macos-safari": {
    group: "desktop",
    browser: "Safari · macOS",
    links: [
      { label: "Safari", href: "https://support.apple.com/en-us/104996" },
    ],
  },
  "windows-firefox": {
    group: "desktop",
    browser: "Firefox · Windows",
    links: [
      {
        label: "Firefox",
        href: "https://support.mozilla.org/kb/web-apps-firefox-windows",
      },
    ],
  },
} as const satisfies Record<string, GuideInfo>

type InstallGuideId = keyof typeof INSTALL_GUIDES

const INSTALL_GUIDE_IDS = Object.keys(INSTALL_GUIDES) as InstallGuideId[]

function isInstallGuideId(guide: string | undefined): guide is InstallGuideId {
  return guide !== undefined && Object.hasOwn(INSTALL_GUIDES, guide)
}

export { INSTALL_GROUPS, INSTALL_GUIDES, INSTALL_GUIDE_IDS, isInstallGuideId }
export type { InstallGuideId }
