import type { OgMetaGeneratorState } from './state'

export type MetaEntry =
  | {
      type: 'title'
      content: string
    }
  | {
      type: 'meta'
      attribute: 'name' | 'property'
      key: string
      content: string
    }
  | {
      type: 'link'
      rel: 'canonical'
      href: string
    }

export type PreviewModel = {
  title: string
  description: string
  siteName: string
  domain: string
  imageUrl: string
  imageAlt: string
  twitterCard: string
}

export type EffectiveMeta = {
  title: string
  description: string
  canonicalUrl: string
  siteName: string
  locale: string
  ogType: string
  ogUrl: string
  imageUrl: string
  imageAlt: string
  imageWidth: string
  imageHeight: string
  twitterCard: string
  twitterSite: string
  twitterCreator: string
  twitterTitle: string
  twitterDescription: string
  twitterImageUrl: string
  twitterImageAlt: string
  articlePublishedTime: string
  articleModifiedTime: string
  articleAuthor: string
  articleSection: string
  articleTags: string[]
}

const trim = (value: string) => value.trim()

const splitTags = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const getDomain = (value: string) => {
  try {
    const url = new URL(value)
    return url.host
  } catch {
    return ''
  }
}

const truncate = (value: string, length: number) =>
  value.length > length ? `${value.slice(0, Math.max(0, length - 1)).trimEnd()}…` : value

export const resolveEffectiveMeta = (state: OgMetaGeneratorState): EffectiveMeta => {
  const title = trim(state.basic.title)
  const description = trim(state.basic.description)
  const canonicalUrl = trim(state.basic.canonicalUrl)
  const siteName = trim(state.basic.siteName)
  const locale = trim(state.basic.locale)
  const ogUrl = trim(state.openGraph.url) || canonicalUrl
  const imageUrl = trim(state.openGraph.image.url)
  const imageAlt = trim(state.openGraph.image.alt)
  const imageWidth = trim(state.openGraph.image.width)
  const imageHeight = trim(state.openGraph.image.height)
  const twitterTitle = state.twitter.inheritFromOpenGraph
    ? title
    : trim(state.twitter.title) || title
  const twitterDescription = state.twitter.inheritFromOpenGraph
    ? description
    : trim(state.twitter.description) || description
  const twitterImageUrl = state.twitter.inheritFromOpenGraph
    ? imageUrl
    : trim(state.twitter.imageUrl) || imageUrl
  const twitterImageAlt = state.twitter.inheritFromOpenGraph
    ? imageAlt
    : trim(state.twitter.imageAlt) || imageAlt

  return {
    title,
    description,
    canonicalUrl,
    siteName,
    locale,
    ogType: state.openGraph.type,
    ogUrl,
    imageUrl,
    imageAlt,
    imageWidth,
    imageHeight,
    twitterCard: state.twitter.card,
    twitterSite: trim(state.twitter.site),
    twitterCreator: trim(state.twitter.creator),
    twitterTitle,
    twitterDescription,
    twitterImageUrl,
    twitterImageAlt,
    articlePublishedTime: trim(state.article.publishedTime),
    articleModifiedTime: trim(state.article.modifiedTime),
    articleAuthor: trim(state.article.author),
    articleSection: trim(state.article.section),
    articleTags: splitTags(state.article.tags),
  }
}

export const buildMetaEntries = (state: OgMetaGeneratorState): MetaEntry[] => {
  const effective = resolveEffectiveMeta(state)
  const entries: MetaEntry[] = []

  if (effective.title) {
    entries.push({ type: 'title', content: effective.title })
  }

  if (effective.description) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'description',
      content: effective.description,
    })
  }

  if (effective.canonicalUrl) {
    entries.push({ type: 'link', rel: 'canonical', href: effective.canonicalUrl })
  }

  if (effective.title) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:title',
      content: effective.title,
    })
  }

  if (effective.description) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:description',
      content: effective.description,
    })
  }

  if (effective.ogType) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:type',
      content: effective.ogType,
    })
  }

  if (effective.ogUrl) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:url',
      content: effective.ogUrl,
    })
  }

  if (effective.siteName) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:site_name',
      content: effective.siteName,
    })
  }

  if (effective.locale) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:locale',
      content: effective.locale,
    })
  }

  if (effective.imageUrl) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:image',
      content: effective.imageUrl,
    })
  }

  if (effective.imageAlt) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:image:alt',
      content: effective.imageAlt,
    })
  }

  if (effective.imageUrl && effective.imageWidth) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:image:width',
      content: effective.imageWidth,
    })
  }

  if (effective.imageUrl && effective.imageHeight) {
    entries.push({
      type: 'meta',
      attribute: 'property',
      key: 'og:image:height',
      content: effective.imageHeight,
    })
  }

  if (effective.twitterCard) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'twitter:card',
      content: effective.twitterCard,
    })
  }

  if (effective.twitterTitle) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'twitter:title',
      content: effective.twitterTitle,
    })
  }

  if (effective.twitterDescription) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'twitter:description',
      content: effective.twitterDescription,
    })
  }

  if (effective.twitterImageUrl) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'twitter:image',
      content: effective.twitterImageUrl,
    })
  }

  if (effective.twitterImageAlt) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'twitter:image:alt',
      content: effective.twitterImageAlt,
    })
  }

  if (effective.twitterSite) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'twitter:site',
      content: effective.twitterSite,
    })
  }

  if (effective.twitterCreator) {
    entries.push({
      type: 'meta',
      attribute: 'name',
      key: 'twitter:creator',
      content: effective.twitterCreator,
    })
  }

  if (effective.ogType === 'article') {
    if (effective.articlePublishedTime) {
      entries.push({
        type: 'meta',
        attribute: 'property',
        key: 'article:published_time',
        content: effective.articlePublishedTime,
      })
    }

    if (effective.articleModifiedTime) {
      entries.push({
        type: 'meta',
        attribute: 'property',
        key: 'article:modified_time',
        content: effective.articleModifiedTime,
      })
    }

    if (effective.articleAuthor) {
      entries.push({
        type: 'meta',
        attribute: 'property',
        key: 'article:author',
        content: effective.articleAuthor,
      })
    }

    if (effective.articleSection) {
      entries.push({
        type: 'meta',
        attribute: 'property',
        key: 'article:section',
        content: effective.articleSection,
      })
    }

    effective.articleTags.forEach((tag) => {
      entries.push({
        type: 'meta',
        attribute: 'property',
        key: 'article:tag',
        content: tag,
      })
    })
  }

  return entries
}

export const renderMetaHtml = (entries: MetaEntry[]) =>
  entries
    .map((entry) => {
      switch (entry.type) {
        case 'title':
          return `<title>${escapeHtml(entry.content)}</title>`
        case 'link':
          return `<link rel="${entry.rel}" href="${escapeHtml(entry.href)}">`
        case 'meta':
          return `<meta ${entry.attribute}="${entry.key}" content="${escapeHtml(entry.content)}">`
      }
    })
    .join('\n')

export const buildMetaHtml = (state: OgMetaGeneratorState) =>
  renderMetaHtml(buildMetaEntries(state))

export const buildPreviewModel = (state: OgMetaGeneratorState): PreviewModel => {
  const effective = resolveEffectiveMeta(state)
  const domainSource = effective.canonicalUrl || effective.ogUrl

  return {
    title: truncate(effective.twitterTitle || effective.title || 'Untitled page', 72),
    description: truncate(
      effective.twitterDescription ||
        effective.description ||
        'Add a description to improve social previews.',
      155,
    ),
    siteName: effective.siteName || 'Website',
    domain: getDomain(domainSource) || 'example.com',
    imageUrl: effective.twitterImageUrl || effective.imageUrl,
    imageAlt: effective.twitterImageAlt || effective.imageAlt,
    twitterCard: effective.twitterCard,
  }
}
