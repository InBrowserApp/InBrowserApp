import type { SitemapItem } from "@astrojs/sitemap"

import { DEFAULT_SITE_LANGUAGE } from "./site"

const X_DEFAULT_HREFLANG = "x-default"

// @astrojs/sitemap (v3.x) does not emit an `x-default` hreflang on its own.
// Google recommends one for multilingual sites so crawlers know which
// localized variant to surface when no other locale matches the user.
function addXDefaultHreflang(item: SitemapItem): SitemapItem {
  const { links } = item
  if (!links || links.length === 0) {
    return item
  }

  if (links.some((link) => link.lang === X_DEFAULT_HREFLANG)) {
    return item
  }

  const defaultLink = links.find((link) => link.lang === DEFAULT_SITE_LANGUAGE)
  if (!defaultLink) {
    return item
  }

  return {
    ...item,
    links: [...links, { url: defaultLink.url, lang: X_DEFAULT_HREFLANG }],
  }
}

export { addXDefaultHreflang }
