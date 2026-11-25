import type { SiteLanguage } from "./site"

// Apple and Microsoft use regional paths for their help articles.
const supportRegions: Partial<Record<SiteLanguage, string>> = {
  "zh-CN": "zh-cn",
  "zh-TW": "zh-tw",
  es: "es-es",
  fr: "fr-fr",
  de: "de-de",
  it: "it-it",
  ja: "ja-jp",
  ko: "ko-kr",
  ru: "ru-ru",
  pt: "pt-pt",
  ar: "ar-sa",
  hi: "hi-in",
  tr: "tr-tr",
  nl: "nl-nl",
  sv: "sv-se",
  pl: "pl-pl",
  vi: "vi-vn",
  th: "th-th",
  id: "id-id",
  he: "he-il",
  no: "no-no",
}

const edgeRegions = { ...supportRegions, hi: undefined, no: "nb-no" }

// These translations are published under a different locale or article path.
const appleArticlePaths: Partial<Record<SiteLanguage, Record<string, string>>> =
  {
    "zh-CN": {
      "/guide/ipad/ipad8f1f7a29/ipados":
        "/zh-hans/guide/ipad/ipad8f1f7a29/ipados",
    },
    hi: { "/104996": "/hi-in/guide/safari/ibrw9e991864/mac" },
  }

const chromeLocales: Partial<Record<SiteLanguage, string>> = {
  "zh-CN": "zh-Hans",
  "zh-TW": "zh-Hant",
  pt: "pt-PT",
  he: "iw",
}

const firefoxLocales: Partial<Record<SiteLanguage, string>> = {
  en: "en-US",
  hi: "hi-IN",
  pt: "pt-PT",
}

function localizeInstallHelpHref(href: string, language: SiteLanguage) {
  const url = new URL(href)

  switch (url.hostname) {
    case "support.google.com":
      url.searchParams.set("hl", chromeLocales[language] ?? language)
      return url.href
    case "support.mozilla.org":
      // SUMO resolves the article slug and falls back when a translation is missing.
      url.pathname = `/${firefoxLocales[language] ?? language}${url.pathname}`
      return url.href
    case "support.apple.com":
    case "support.microsoft.com": {
      const isApple = url.hostname === "support.apple.com"
      const region = (isApple ? supportRegions : edgeRegions)[language]
      if (!region) return href

      const articlePath = url.pathname.replace(/^\/[^/]+/, "")
      const localizedPath = isApple
        ? appleArticlePaths[language]?.[articlePath]
        : undefined
      url.pathname = localizedPath ?? `/${region}${articlePath}`
      return url.href
    }
    default:
      return href
  }
}

export { localizeInstallHelpHref }
