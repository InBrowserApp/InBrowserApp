import type { NormalizedUrlEntry, SitemapState, UrlEntry } from './sitemapState'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const isAbsoluteUrl = (value: string) =>
  /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//')

const normalizeUrl = (value: string, baseUrl: string, autoJoin: boolean) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (!autoJoin) return trimmed
  const base = baseUrl.trim()
  if (!base || isAbsoluteUrl(trimmed)) return trimmed
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedValue = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `${normalizedBase}/${normalizedValue}`
}

const normalizeUrlsetEntry = (entry: UrlEntry, input: SitemapState): NormalizedUrlEntry | null => {
  const loc = normalizeUrl(entry.loc, input.baseUrl, input.autoJoin)
  if (!loc) return null

  const images = entry.images
    .map((image) => ({
      loc: normalizeUrl(image.loc, input.baseUrl, input.autoJoin),
      title: image.title.trim(),
      caption: image.caption.trim(),
      license: normalizeUrl(image.license, input.baseUrl, input.autoJoin),
    }))
    .filter((image) => image.loc)

  const videos = entry.videos
    .map((video) => ({
      thumbnailLoc: normalizeUrl(video.thumbnailLoc, input.baseUrl, input.autoJoin),
      title: video.title.trim(),
      description: video.description.trim(),
      contentLoc: normalizeUrl(video.contentLoc, input.baseUrl, input.autoJoin),
      playerLoc: normalizeUrl(video.playerLoc, input.baseUrl, input.autoJoin),
      duration:
        typeof video.duration === 'number' && !Number.isNaN(video.duration)
          ? Math.round(video.duration)
          : null,
      publicationDate: video.publicationDate.trim(),
    }))
    .filter(
      (video) =>
        video.thumbnailLoc &&
        video.title &&
        video.description &&
        (video.contentLoc || video.playerLoc),
    )

  const news = entry.news
    .map((item) => ({
      publicationName: item.publicationName.trim(),
      publicationLanguage: item.publicationLanguage.trim(),
      title: item.title.trim(),
      publicationDate: item.publicationDate.trim(),
      keywords: item.keywords.trim(),
    }))
    .filter(
      (item) =>
        item.publicationName && item.publicationLanguage && item.title && item.publicationDate,
    )

  return {
    loc,
    lastmod: entry.lastmod.trim(),
    changefreq: entry.changefreq,
    priority:
      typeof entry.priority === 'number' && !Number.isNaN(entry.priority) ? entry.priority : null,
    images,
    videos,
    news,
  }
}

export const buildUrlset = (input: SitemapState) => {
  const entries = input.urls
    .map((entry) => normalizeUrlsetEntry(entry, input))
    .filter((entry): entry is NormalizedUrlEntry => Boolean(entry))

  if (entries.length === 0) return ''

  const hasImages = entries.some((entry) => entry.images.length > 0)
  const hasVideos = entries.some((entry) => entry.videos.length > 0)
  const hasNews = entries.some((entry) => entry.news.length > 0)

  const namespaces = ['xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"']
  if (hasImages) namespaces.push('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')
  if (hasVideos) namespaces.push('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"')
  if (hasNews) namespaces.push('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"')

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', `<urlset ${namespaces.join(' ')}>`]

  entries.forEach((entry) => {
    lines.push('  <url>')
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`)

    if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`)
    if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
    if (entry.priority !== null) lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)

    entry.images.forEach((image) => {
      lines.push('    <image:image>')
      lines.push(`      <image:loc>${escapeXml(image.loc)}</image:loc>`)
      if (image.title) lines.push(`      <image:title>${escapeXml(image.title)}</image:title>`)
      if (image.caption)
        lines.push(`      <image:caption>${escapeXml(image.caption)}</image:caption>`)
      if (image.license)
        lines.push(`      <image:license>${escapeXml(image.license)}</image:license>`)
      lines.push('    </image:image>')
    })

    entry.videos.forEach((video) => {
      lines.push('    <video:video>')
      lines.push(
        `      <video:thumbnail_loc>${escapeXml(video.thumbnailLoc)}</video:thumbnail_loc>`,
      )
      lines.push(`      <video:title>${escapeXml(video.title)}</video:title>`)
      lines.push(`      <video:description>${escapeXml(video.description)}</video:description>`)
      if (video.contentLoc)
        lines.push(`      <video:content_loc>${escapeXml(video.contentLoc)}</video:content_loc>`)
      if (video.playerLoc)
        lines.push(`      <video:player_loc>${escapeXml(video.playerLoc)}</video:player_loc>`)
      if (video.duration !== null)
        lines.push(`      <video:duration>${video.duration}</video:duration>`)
      if (video.publicationDate)
        lines.push(
          `      <video:publication_date>${escapeXml(video.publicationDate)}</video:publication_date>`,
        )
      lines.push('    </video:video>')
    })

    entry.news.forEach((newsItem) => {
      lines.push('    <news:news>')
      lines.push('      <news:publication>')
      lines.push(`        <news:name>${escapeXml(newsItem.publicationName)}</news:name>`)
      lines.push(
        `        <news:language>${escapeXml(newsItem.publicationLanguage)}</news:language>`,
      )
      lines.push('      </news:publication>')
      lines.push(
        `      <news:publication_date>${escapeXml(newsItem.publicationDate)}</news:publication_date>`,
      )
      lines.push(`      <news:title>${escapeXml(newsItem.title)}</news:title>`)
      if (newsItem.keywords)
        lines.push(`      <news:keywords>${escapeXml(newsItem.keywords)}</news:keywords>`)
      lines.push('    </news:news>')
    })

    lines.push('  </url>')
  })

  lines.push('</urlset>')

  return lines.join('\n')
}

export const buildSitemapIndex = (input: SitemapState) => {
  const entries = input.sitemaps
    .map((entry) => ({
      loc: normalizeUrl(entry.loc, input.baseUrl, input.autoJoin),
      lastmod: entry.lastmod.trim(),
    }))
    .filter((entry) => entry.loc)

  if (entries.length === 0) return ''

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]

  entries.forEach((entry) => {
    lines.push('  <sitemap>')
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`)
    if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`)
    lines.push('  </sitemap>')
  })

  lines.push('</sitemapindex>')

  return lines.join('\n')
}
