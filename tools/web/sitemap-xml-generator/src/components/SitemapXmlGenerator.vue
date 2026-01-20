<template>
  <div>
    <ToolSectionHeader>{{ t('presets') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex :wrap="true" :size="8">
        <n-button size="small" @click="applyPreset('basic')" data-testid="preset-basic">
          {{ t('presetBasic') }}
        </n-button>
        <n-button size="small" @click="applyPreset('image')" data-testid="preset-image">
          {{ t('presetImage') }}
        </n-button>
        <n-button size="small" @click="applyPreset('video')" data-testid="preset-video">
          {{ t('presetVideo') }}
        </n-button>
        <n-button size="small" @click="applyPreset('news')" data-testid="preset-news">
          {{ t('presetNews') }}
        </n-button>
        <n-button size="small" @click="applyPreset('index')" data-testid="preset-index">
          {{ t('presetIndex') }}
        </n-button>
      </n-flex>
    </ToolSection>

    <ToolSectionHeader>{{ t('settings') }}</ToolSectionHeader>
    <ToolSection>
      <n-space vertical :size="12">
        <n-text depth="3">{{ t('baseUrl') }}</n-text>
        <n-input
          v-model:value="state.baseUrl"
          placeholder="https://example.com"
          data-testid="base-url"
        />
        <n-flex align="center" justify="space-between">
          <n-text>{{ t('autoJoin') }}</n-text>
          <n-switch v-model:value="state.autoJoin" data-testid="auto-join" />
        </n-flex>
      </n-space>
    </ToolSection>

    <n-tabs v-model:value="state.mode" type="line" animated>
      <n-tab-pane name="urlset" :tab="t('modeUrlset')">
        <ToolSectionHeader>{{ t('urlEntries') }}</ToolSectionHeader>
        <ToolSection>
          <n-space vertical :size="16">
            <n-card
              v-for="(entry, index) in state.urls"
              :key="entry.id"
              size="small"
              data-testid="url-card"
            >
              <n-flex align="center" justify="space-between">
                <n-text strong>{{ t('urlEntryTitle', { index: index + 1 }) }}</n-text>
                <n-button
                  text
                  :disabled="state.urls.length === 1"
                  @click="removeUrl(index)"
                  :data-testid="`remove-url-${index}`"
                >
                  <template #icon>
                    <n-icon :component="Delete16Regular" />
                  </template>
                  {{ t('removeUrl') }}
                </n-button>
              </n-flex>

              <n-space vertical :size="12" style="margin-top: 12px">
                <n-text depth="3">{{ t('loc') }}</n-text>
                <n-input
                  v-model:value="entry.loc"
                  placeholder="https://example.com/page"
                  :data-testid="`url-loc-${index}`"
                />

                <n-text depth="3">{{ t('lastmod') }}</n-text>
                <n-input v-model:value="entry.lastmod" placeholder="2024-01-15" />

                <n-text depth="3">{{ t('changefreq') }}</n-text>
                <n-select v-model:value="entry.changefreq" :options="changefreqOptions" clearable />

                <n-text depth="3">{{ t('priority') }}</n-text>
                <n-input-number
                  v-model:value="entry.priority"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  :precision="1"
                  placeholder="0.5"
                />

                <n-text depth="3">{{ t('images') }}</n-text>
                <n-dynamic-input v-model:value="entry.images" :on-create="createImageEntry">
                  <template #create-button-default>{{ t('addImage') }}</template>
                  <template #default="{ index: imageIndex }">
                    <n-space vertical :size="8">
                      <n-text depth="3">{{ t('imageUrl') }}</n-text>
                      <n-input
                        v-model:value="entry.images[imageIndex]!.loc"
                        placeholder="https://example.com/image.jpg"
                      />
                      <n-input
                        v-model:value="entry.images[imageIndex]!.title"
                        :placeholder="t('title')"
                      />
                      <n-input
                        v-model:value="entry.images[imageIndex]!.caption"
                        :placeholder="t('caption')"
                      />
                      <n-text depth="3">{{ t('licenseUrl') }}</n-text>
                      <n-input
                        v-model:value="entry.images[imageIndex]!.license"
                        placeholder="https://example.com/license"
                      />
                    </n-space>
                  </template>
                </n-dynamic-input>

                <n-text depth="3">{{ t('videos') }}</n-text>
                <n-dynamic-input v-model:value="entry.videos" :on-create="createVideoEntry">
                  <template #create-button-default>{{ t('addVideo') }}</template>
                  <template #default="{ index: videoIndex }">
                    <n-space vertical :size="8">
                      <n-text depth="3">{{ t('thumbnailUrl') }}</n-text>
                      <n-input
                        v-model:value="entry.videos[videoIndex]!.thumbnailLoc"
                        placeholder="https://example.com/thumb.jpg"
                      />
                      <n-input
                        v-model:value="entry.videos[videoIndex]!.title"
                        :placeholder="t('title')"
                      />
                      <n-input
                        v-model:value="entry.videos[videoIndex]!.description"
                        :placeholder="t('description')"
                      />
                      <n-text depth="3">{{ t('contentUrl') }}</n-text>
                      <n-input
                        v-model:value="entry.videos[videoIndex]!.contentLoc"
                        placeholder="https://example.com/video.mp4"
                      />
                      <n-text depth="3">{{ t('playerUrl') }}</n-text>
                      <n-input
                        v-model:value="entry.videos[videoIndex]!.playerLoc"
                        placeholder="https://example.com/player"
                      />
                      <n-input-number
                        v-model:value="entry.videos[videoIndex]!.duration"
                        :min="0"
                        :step="1"
                        :precision="0"
                        :placeholder="t('duration')"
                      />
                      <n-input
                        v-model:value="entry.videos[videoIndex]!.publicationDate"
                        :placeholder="t('publicationDate')"
                      />
                    </n-space>
                  </template>
                </n-dynamic-input>

                <n-text depth="3">{{ t('news') }}</n-text>
                <n-dynamic-input v-model:value="entry.news" :on-create="createNewsEntry">
                  <template #create-button-default>{{ t('addNews') }}</template>
                  <template #default="{ index: newsIndex }">
                    <n-space vertical :size="8">
                      <n-input
                        v-model:value="entry.news[newsIndex]!.publicationName"
                        :placeholder="t('publicationName')"
                      />
                      <n-text depth="3">{{ t('publicationLanguage') }}</n-text>
                      <n-input
                        v-model:value="entry.news[newsIndex]!.publicationLanguage"
                        placeholder="en"
                      />
                      <n-input
                        v-model:value="entry.news[newsIndex]!.title"
                        :placeholder="t('title')"
                      />
                      <n-input
                        v-model:value="entry.news[newsIndex]!.publicationDate"
                        :placeholder="t('publicationDate')"
                      />
                      <n-input
                        v-model:value="entry.news[newsIndex]!.keywords"
                        :placeholder="t('keywords')"
                      />
                    </n-space>
                  </template>
                </n-dynamic-input>
              </n-space>
            </n-card>

            <n-button type="primary" dashed @click="addUrl" data-testid="add-url">
              <template #icon>
                <n-icon :component="Add16Regular" />
              </template>
              {{ t('addUrl') }}
            </n-button>
          </n-space>
        </ToolSection>
      </n-tab-pane>

      <n-tab-pane name="sitemapindex" :tab="t('modeSitemapIndex')">
        <ToolSectionHeader>{{ t('sitemapEntries') }}</ToolSectionHeader>
        <ToolSection>
          <n-space vertical :size="16">
            <n-card
              v-for="(entry, index) in state.sitemaps"
              :key="entry.id"
              size="small"
              data-testid="sitemap-card"
            >
              <n-flex align="center" justify="space-between">
                <n-text strong>{{ t('sitemapEntryTitle', { index: index + 1 }) }}</n-text>
                <n-button
                  text
                  :disabled="state.sitemaps.length === 1"
                  @click="removeSitemap(index)"
                  :data-testid="`remove-sitemap-${index}`"
                >
                  <template #icon>
                    <n-icon :component="Delete16Regular" />
                  </template>
                  {{ t('removeSitemap') }}
                </n-button>
              </n-flex>

              <n-space vertical :size="12" style="margin-top: 12px">
                <n-text depth="3">{{ t('sitemapLoc') }}</n-text>
                <n-input
                  v-model:value="entry.loc"
                  placeholder="https://example.com/sitemap.xml"
                  :data-testid="`sitemap-loc-${index}`"
                />

                <n-text depth="3">{{ t('sitemapLastmod') }}</n-text>
                <n-input v-model:value="entry.lastmod" placeholder="2024-01-15" />
              </n-space>
            </n-card>

            <n-button type="primary" dashed @click="addSitemap" data-testid="add-sitemap">
              <template #icon>
                <n-icon :component="Add16Regular" />
              </template>
              {{ t('addSitemap') }}
            </n-button>
          </n-space>
        </ToolSection>
      </n-tab-pane>
    </n-tabs>

    <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
    <ToolSection>
      <n-space vertical :size="12">
        <n-flex align="center" justify="space-between">
          <n-text depth="3">{{ t('output') }}</n-text>
          <n-flex align="center" :size="8">
            <CopyToClipboardButton v-if="hasOutput" :content="xmlContent" />
            <n-button
              text
              tag="a"
              :href="downloadHref"
              :download="downloadName"
              :disabled="!downloadHref"
              data-testid="download-sitemap"
            >
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download') }}
            </n-button>
          </n-flex>
        </n-flex>

        <n-text v-if="!hasOutput" depth="3">{{ t('emptyOutput') }}</n-text>

        <n-input
          :value="xmlContent"
          type="textarea"
          readonly
          :autosize="{ minRows: 10, maxRows: 24 }"
          data-testid="sitemap-output"
        />
      </n-space>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  NButton,
  NCard,
  NDynamicInput,
  NFlex,
  NIcon,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NSwitch,
  NTabPane,
  NTabs,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import Add16Regular from '@vicons/fluent/Add16Regular'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'

const { t } = useI18n()

type Mode = 'urlset' | 'sitemapindex'

type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

type ImageEntry = {
  loc: string
  title: string
  caption: string
  license: string
}

type VideoEntry = {
  thumbnailLoc: string
  title: string
  description: string
  contentLoc: string
  playerLoc: string
  duration: number | null
  publicationDate: string
}

type NewsEntry = {
  publicationName: string
  publicationLanguage: string
  title: string
  publicationDate: string
  keywords: string
}

type UrlEntry = {
  id: string
  loc: string
  lastmod: string
  changefreq: Changefreq | null
  priority: number | null
  images: ImageEntry[]
  videos: VideoEntry[]
  news: NewsEntry[]
}

type SitemapEntry = {
  id: string
  loc: string
  lastmod: string
}

type SitemapState = {
  mode: Mode
  baseUrl: string
  autoJoin: boolean
  urls: UrlEntry[]
  sitemaps: SitemapEntry[]
}

type NormalizedUrlEntry = {
  loc: string
  lastmod: string
  changefreq: Changefreq | null
  priority: number | null
  images: ImageEntry[]
  videos: VideoEntry[]
  news: NewsEntry[]
}

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createUrlEntry = (overrides: Partial<UrlEntry> = {}): UrlEntry => ({
  id: createId(),
  loc: '',
  lastmod: '',
  changefreq: null,
  priority: null,
  images: [],
  videos: [],
  news: [],
  ...overrides,
})

const createSitemapEntry = (overrides: Partial<SitemapEntry> = {}): SitemapEntry => ({
  id: createId(),
  loc: '',
  lastmod: '',
  ...overrides,
})

const createImageEntry = (): ImageEntry => ({ loc: '', title: '', caption: '', license: '' })
const createVideoEntry = (): VideoEntry => ({
  thumbnailLoc: '',
  title: '',
  description: '',
  contentLoc: '',
  playerLoc: '',
  duration: null,
  publicationDate: '',
})
const createNewsEntry = (): NewsEntry => ({
  publicationName: '',
  publicationLanguage: '',
  title: '',
  publicationDate: '',
  keywords: '',
})

const defaultState = (): SitemapState => ({
  mode: 'urlset',
  baseUrl: 'https://example.com',
  autoJoin: true,
  urls: [
    createUrlEntry({
      loc: '/',
      lastmod: '2024-01-15',
      changefreq: 'weekly',
      priority: 1,
    }),
  ],
  sitemaps: [createSitemapEntry({ loc: '/sitemap.xml' })],
})

const state = useStorage<SitemapState>('tools:sitemap-xml-generator:state', defaultState())

const changefreqOptions = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(
  (value) => ({ label: value, value }),
)

const addUrl = () => {
  state.value.urls.push(createUrlEntry())
}

const removeUrl = (index: number) => {
  if (state.value.urls.length <= 1) return
  state.value.urls.splice(index, 1)
}

const addSitemap = () => {
  state.value.sitemaps.push(createSitemapEntry())
}

const removeSitemap = (index: number) => {
  if (state.value.sitemaps.length <= 1) return
  state.value.sitemaps.splice(index, 1)
}

const applyPreset = (preset: 'basic' | 'image' | 'video' | 'news' | 'index') => {
  const baseUrl = 'https://example.com'
  switch (preset) {
    case 'basic':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/',
          lastmod: '2024-01-15',
          changefreq: 'weekly',
          priority: 1,
        }),
        createUrlEntry({
          loc: '/about',
          lastmod: '2024-01-10',
          changefreq: 'monthly',
          priority: 0.6,
        }),
      ]
      break
    case 'image':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/gallery',
          images: [
            {
              loc: '/images/hero.jpg',
              title: 'Hero image',
              caption: 'Homepage hero',
              license: 'https://example.com/license',
            },
          ],
        }),
      ]
      break
    case 'video':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/videos/intro',
          videos: [
            {
              thumbnailLoc: '/images/video-thumb.jpg',
              title: 'Intro video',
              description: 'Intro to our product',
              contentLoc: 'https://example.com/videos/intro.mp4',
              playerLoc: '',
              duration: 120,
              publicationDate: '2024-01-20',
            },
          ],
        }),
      ]
      break
    case 'news':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/news/launch',
          news: [
            {
              publicationName: 'Example News',
              publicationLanguage: 'en',
              title: 'Product launch',
              publicationDate: '2024-01-25',
              keywords: 'launch, product',
            },
          ],
        }),
      ]
      break
    case 'index':
      state.value.mode = 'sitemapindex'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.sitemaps = [
        createSitemapEntry({
          loc: '/sitemap-1.xml',
          lastmod: '2024-01-15',
        }),
        createSitemapEntry({
          loc: '/sitemap-2.xml',
          lastmod: '2024-01-18',
        }),
      ]
      break
    default:
      break
  }
}

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

const buildUrlset = (input: SitemapState) => {
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

const buildSitemapIndex = (input: SitemapState) => {
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

const xmlContent = computed(() =>
  state.value.mode === 'urlset' ? buildUrlset(state.value) : buildSitemapIndex(state.value),
)
const hasOutput = computed(() => xmlContent.value.trim().length > 0)
const downloadName = computed(() =>
  state.value.mode === 'sitemapindex' ? 'sitemap-index.xml' : 'sitemap.xml',
)
const downloadBlob = computed(() =>
  hasOutput.value ? new Blob([xmlContent.value], { type: 'application/xml' }) : null,
)
const downloadUrl = useObjectUrl(downloadBlob)
const downloadHref = computed(() =>
  hasOutput.value ? (downloadUrl.value ?? undefined) : undefined,
)
</script>

<i18n lang="json">
{
  "en": {
    "modeUrlset": "URL set",
    "modeSitemapIndex": "Sitemap index",
    "presets": "Presets",
    "presetBasic": "Basic example",
    "presetImage": "Image example",
    "presetVideo": "Video example",
    "presetNews": "News example",
    "presetIndex": "Sitemap index example",
    "settings": "Settings",
    "baseUrl": "Base URL",
    "autoJoin": "Auto-join relative URLs",
    "urlEntries": "URL entries",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Remove URL",
    "addUrl": "Add URL",
    "loc": "URL",
    "lastmod": "Last modified",
    "changefreq": "Change frequency",
    "priority": "Priority",
    "images": "Images",
    "addImage": "Add image",
    "imageUrl": "Image URL",
    "title": "Title",
    "caption": "Caption",
    "licenseUrl": "License URL",
    "videos": "Videos",
    "addVideo": "Add video",
    "thumbnailUrl": "Thumbnail URL",
    "description": "Description",
    "contentUrl": "Content URL",
    "playerUrl": "Player URL",
    "duration": "Duration (seconds)",
    "publicationDate": "Publication date",
    "news": "News",
    "addNews": "Add news",
    "publicationName": "Publication name",
    "publicationLanguage": "Publication language",
    "keywords": "Keywords",
    "sitemapEntries": "Sitemap entries",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Remove sitemap",
    "addSitemap": "Add sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "Last modified",
    "output": "Output",
    "download": "Download sitemap.xml",
    "emptyOutput": "No content to export yet."
  },
  "zh": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引",
    "presets": "预设",
    "presetBasic": "基础示例",
    "presetImage": "图片示例",
    "presetVideo": "视频示例",
    "presetNews": "新闻示例",
    "presetIndex": "Sitemap 索引示例",
    "settings": "设置",
    "baseUrl": "基础 URL",
    "autoJoin": "自动拼接相对 URL",
    "urlEntries": "URL 列表",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "添加 URL",
    "loc": "URL",
    "lastmod": "最后修改",
    "changefreq": "更新频率",
    "priority": "优先级",
    "images": "图片",
    "addImage": "添加图片",
    "imageUrl": "图片 URL",
    "title": "标题",
    "caption": "说明",
    "licenseUrl": "许可 URL",
    "videos": "视频",
    "addVideo": "添加视频",
    "thumbnailUrl": "缩略图 URL",
    "description": "描述",
    "contentUrl": "内容 URL",
    "playerUrl": "播放器 URL",
    "duration": "时长（秒）",
    "publicationDate": "发布日期",
    "news": "新闻",
    "addNews": "添加新闻",
    "publicationName": "出版物名称",
    "publicationLanguage": "出版物语言",
    "keywords": "关键词",
    "sitemapEntries": "Sitemap 列表",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "添加 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最后修改",
    "output": "输出",
    "download": "下载 sitemap.xml",
    "emptyOutput": "暂无可导出的内容。"
  },
  "zh-CN": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引",
    "presets": "预设",
    "presetBasic": "基础示例",
    "presetImage": "图片示例",
    "presetVideo": "视频示例",
    "presetNews": "新闻示例",
    "presetIndex": "Sitemap 索引示例",
    "settings": "设置",
    "baseUrl": "基础 URL",
    "autoJoin": "自动拼接相对 URL",
    "urlEntries": "URL 列表",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "添加 URL",
    "loc": "URL",
    "lastmod": "最后修改",
    "changefreq": "更新频率",
    "priority": "优先级",
    "images": "图片",
    "addImage": "添加图片",
    "imageUrl": "图片 URL",
    "title": "标题",
    "caption": "说明",
    "licenseUrl": "许可 URL",
    "videos": "视频",
    "addVideo": "添加视频",
    "thumbnailUrl": "缩略图 URL",
    "description": "描述",
    "contentUrl": "内容 URL",
    "playerUrl": "播放器 URL",
    "duration": "时长（秒）",
    "publicationDate": "发布日期",
    "news": "新闻",
    "addNews": "添加新闻",
    "publicationName": "出版物名称",
    "publicationLanguage": "出版物语言",
    "keywords": "关键词",
    "sitemapEntries": "Sitemap 列表",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "添加 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最后修改",
    "output": "输出",
    "download": "下载 sitemap.xml",
    "emptyOutput": "暂无可导出的内容。"
  },
  "zh-TW": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引",
    "presets": "預設",
    "presetBasic": "基礎範例",
    "presetImage": "圖片範例",
    "presetVideo": "影片範例",
    "presetNews": "新聞範例",
    "presetIndex": "Sitemap 索引範例",
    "settings": "設定",
    "baseUrl": "基礎 URL",
    "autoJoin": "自動拼接相對 URL",
    "urlEntries": "URL 清單",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "新增 URL",
    "loc": "URL",
    "lastmod": "最後修改",
    "changefreq": "更新頻率",
    "priority": "優先順序",
    "images": "圖片",
    "addImage": "新增圖片",
    "imageUrl": "圖片 URL",
    "title": "標題",
    "caption": "說明",
    "licenseUrl": "授權 URL",
    "videos": "影片",
    "addVideo": "新增影片",
    "thumbnailUrl": "縮圖 URL",
    "description": "描述",
    "contentUrl": "內容 URL",
    "playerUrl": "播放器 URL",
    "duration": "時長（秒）",
    "publicationDate": "發布日期",
    "news": "新聞",
    "addNews": "新增新聞",
    "publicationName": "出版物名稱",
    "publicationLanguage": "出版物語言",
    "keywords": "關鍵字",
    "sitemapEntries": "Sitemap 清單",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "新增 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最後修改",
    "output": "輸出",
    "download": "下載 sitemap.xml",
    "emptyOutput": "目前沒有可匯出的內容。"
  },
  "zh-HK": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引",
    "presets": "預設",
    "presetBasic": "基礎範例",
    "presetImage": "圖片範例",
    "presetVideo": "影片範例",
    "presetNews": "新聞範例",
    "presetIndex": "Sitemap 索引範例",
    "settings": "設定",
    "baseUrl": "基礎 URL",
    "autoJoin": "自動拼接相對 URL",
    "urlEntries": "URL 清單",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "新增 URL",
    "loc": "URL",
    "lastmod": "最後修改",
    "changefreq": "更新頻率",
    "priority": "優先順序",
    "images": "圖片",
    "addImage": "新增圖片",
    "imageUrl": "圖片 URL",
    "title": "標題",
    "caption": "說明",
    "licenseUrl": "授權 URL",
    "videos": "影片",
    "addVideo": "新增影片",
    "thumbnailUrl": "縮圖 URL",
    "description": "描述",
    "contentUrl": "內容 URL",
    "playerUrl": "播放器 URL",
    "duration": "時長（秒）",
    "publicationDate": "發布日期",
    "news": "新聞",
    "addNews": "新增新聞",
    "publicationName": "出版物名稱",
    "publicationLanguage": "出版物語言",
    "keywords": "關鍵字",
    "sitemapEntries": "Sitemap 清單",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "新增 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最後修改",
    "output": "輸出",
    "download": "下載 sitemap.xml",
    "emptyOutput": "目前沒有可匯出的內容。"
  },
  "es": {
    "modeUrlset": "Conjunto de URL",
    "modeSitemapIndex": "Índice de sitemaps",
    "presets": "Preajustes",
    "presetBasic": "Ejemplo básico",
    "presetImage": "Ejemplo de imágenes",
    "presetVideo": "Ejemplo de vídeo",
    "presetNews": "Ejemplo de noticias",
    "presetIndex": "Ejemplo de índice de sitemaps",
    "settings": "Configuración",
    "baseUrl": "URL base",
    "autoJoin": "Unir automáticamente URLs relativas",
    "urlEntries": "Entradas de URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Eliminar URL",
    "addUrl": "Agregar URL",
    "loc": "URL",
    "lastmod": "Última modificación",
    "changefreq": "Frecuencia de cambio",
    "priority": "Prioridad",
    "images": "Imágenes",
    "addImage": "Agregar imagen",
    "imageUrl": "URL de la imagen",
    "title": "Título",
    "caption": "Leyenda",
    "licenseUrl": "URL de licencia",
    "videos": "Vídeos",
    "addVideo": "Agregar vídeo",
    "thumbnailUrl": "URL de miniatura",
    "description": "Descripción",
    "contentUrl": "URL de contenido",
    "playerUrl": "URL del reproductor",
    "duration": "Duración (segundos)",
    "publicationDate": "Fecha de publicación",
    "news": "Noticias",
    "addNews": "Agregar noticia",
    "publicationName": "Nombre de la publicación",
    "publicationLanguage": "Idioma de la publicación",
    "keywords": "Palabras clave",
    "sitemapEntries": "Entradas de sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Eliminar sitemap",
    "addSitemap": "Agregar sitemap",
    "sitemapLoc": "URL del sitemap",
    "sitemapLastmod": "Última modificación",
    "output": "Salida",
    "download": "Descargar sitemap.xml",
    "emptyOutput": "Aún no hay contenido para exportar."
  },
  "fr": {
    "modeUrlset": "Ensemble d'URL",
    "modeSitemapIndex": "Index de sitemaps",
    "presets": "Préréglages",
    "presetBasic": "Exemple de base",
    "presetImage": "Exemple d'images",
    "presetVideo": "Exemple de vidéo",
    "presetNews": "Exemple d'actualités",
    "presetIndex": "Exemple d'index de sitemaps",
    "settings": "Paramètres",
    "baseUrl": "URL de base",
    "autoJoin": "Assembler automatiquement les URL relatives",
    "urlEntries": "Entrées d'URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Supprimer l'URL",
    "addUrl": "Ajouter une URL",
    "loc": "URL",
    "lastmod": "Dernière modification",
    "changefreq": "Fréquence de changement",
    "priority": "Priorité",
    "images": "Images",
    "addImage": "Ajouter une image",
    "imageUrl": "URL de l'image",
    "title": "Titre",
    "caption": "Légende",
    "licenseUrl": "URL de licence",
    "videos": "Vidéos",
    "addVideo": "Ajouter une vidéo",
    "thumbnailUrl": "URL de miniature",
    "description": "Description",
    "contentUrl": "URL du contenu",
    "playerUrl": "URL du lecteur",
    "duration": "Durée (secondes)",
    "publicationDate": "Date de publication",
    "news": "Actualités",
    "addNews": "Ajouter une actualité",
    "publicationName": "Nom de la publication",
    "publicationLanguage": "Langue de la publication",
    "keywords": "Mots-clés",
    "sitemapEntries": "Entrées de sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Supprimer le sitemap",
    "addSitemap": "Ajouter un sitemap",
    "sitemapLoc": "URL du sitemap",
    "sitemapLastmod": "Dernière modification",
    "output": "Sortie",
    "download": "Télécharger sitemap.xml",
    "emptyOutput": "Aucun contenu à exporter pour l'instant."
  },
  "de": {
    "modeUrlset": "URL-Satz",
    "modeSitemapIndex": "Sitemap-Index",
    "presets": "Voreinstellungen",
    "presetBasic": "Basisbeispiel",
    "presetImage": "Bildbeispiel",
    "presetVideo": "Videobeispiel",
    "presetNews": "News-Beispiel",
    "presetIndex": "Sitemap-Index-Beispiel",
    "settings": "Einstellungen",
    "baseUrl": "Basis-URL",
    "autoJoin": "Relative URLs automatisch verbinden",
    "urlEntries": "URL-Einträge",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL entfernen",
    "addUrl": "URL hinzufügen",
    "loc": "URL",
    "lastmod": "Zuletzt geändert",
    "changefreq": "Änderungshäufigkeit",
    "priority": "Priorität",
    "images": "Bilder",
    "addImage": "Bild hinzufügen",
    "imageUrl": "Bild-URL",
    "title": "Titel",
    "caption": "Bildunterschrift",
    "licenseUrl": "Lizenz-URL",
    "videos": "Videos",
    "addVideo": "Video hinzufügen",
    "thumbnailUrl": "Vorschaubild-URL",
    "description": "Beschreibung",
    "contentUrl": "Inhalt-URL",
    "playerUrl": "Player-URL",
    "duration": "Dauer (Sekunden)",
    "publicationDate": "Veröffentlichungsdatum",
    "news": "News",
    "addNews": "News hinzufügen",
    "publicationName": "Publikationsname",
    "publicationLanguage": "Publikationssprache",
    "keywords": "Schlüsselwörter",
    "sitemapEntries": "Sitemap-Einträge",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap entfernen",
    "addSitemap": "Sitemap hinzufügen",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Zuletzt geändert",
    "output": "Ausgabe",
    "download": "sitemap.xml herunterladen",
    "emptyOutput": "Noch kein Inhalt zum Exportieren."
  },
  "it": {
    "modeUrlset": "Set di URL",
    "modeSitemapIndex": "Indice sitemap",
    "presets": "Preimpostazioni",
    "presetBasic": "Esempio base",
    "presetImage": "Esempio immagini",
    "presetVideo": "Esempio video",
    "presetNews": "Esempio notizie",
    "presetIndex": "Esempio indice sitemap",
    "settings": "Impostazioni",
    "baseUrl": "URL di base",
    "autoJoin": "Unisci automaticamente URL relative",
    "urlEntries": "Voci URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Rimuovi URL",
    "addUrl": "Aggiungi URL",
    "loc": "URL",
    "lastmod": "Ultima modifica",
    "changefreq": "Frequenza di modifica",
    "priority": "Priorità",
    "images": "Immagini",
    "addImage": "Aggiungi immagine",
    "imageUrl": "URL immagine",
    "title": "Titolo",
    "caption": "Didascalia",
    "licenseUrl": "URL licenza",
    "videos": "Video",
    "addVideo": "Aggiungi video",
    "thumbnailUrl": "URL miniatura",
    "description": "Descrizione",
    "contentUrl": "URL contenuto",
    "playerUrl": "URL player",
    "duration": "Durata (secondi)",
    "publicationDate": "Data di pubblicazione",
    "news": "Notizie",
    "addNews": "Aggiungi notizia",
    "publicationName": "Nome della pubblicazione",
    "publicationLanguage": "Lingua della pubblicazione",
    "keywords": "Parole chiave",
    "sitemapEntries": "Voci sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Rimuovi sitemap",
    "addSitemap": "Aggiungi sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Ultima modifica",
    "output": "Output",
    "download": "Scarica sitemap.xml",
    "emptyOutput": "Nessun contenuto da esportare."
  },
  "ja": {
    "modeUrlset": "URL セット",
    "modeSitemapIndex": "サイトマップインデックス",
    "presets": "プリセット",
    "presetBasic": "基本例",
    "presetImage": "画像の例",
    "presetVideo": "動画の例",
    "presetNews": "ニュースの例",
    "presetIndex": "サイトマップインデックスの例",
    "settings": "設定",
    "baseUrl": "ベース URL",
    "autoJoin": "相対 URL を自動結合",
    "urlEntries": "URL エントリ",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL を削除",
    "addUrl": "URL を追加",
    "loc": "URL",
    "lastmod": "最終更新",
    "changefreq": "更新頻度",
    "priority": "優先度",
    "images": "画像",
    "addImage": "画像を追加",
    "imageUrl": "画像 URL",
    "title": "タイトル",
    "caption": "キャプション",
    "licenseUrl": "ライセンス URL",
    "videos": "動画",
    "addVideo": "動画を追加",
    "thumbnailUrl": "サムネイル URL",
    "description": "説明",
    "contentUrl": "コンテンツ URL",
    "playerUrl": "プレーヤー URL",
    "duration": "再生時間（秒）",
    "publicationDate": "公開日",
    "news": "ニュース",
    "addNews": "ニュースを追加",
    "publicationName": "媒体名",
    "publicationLanguage": "媒体言語",
    "keywords": "キーワード",
    "sitemapEntries": "Sitemap エントリ",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap を削除",
    "addSitemap": "Sitemap を追加",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最終更新",
    "output": "出力",
    "download": "sitemap.xml をダウンロード",
    "emptyOutput": "まだ出力内容がありません。"
  },
  "ko": {
    "modeUrlset": "URL 세트",
    "modeSitemapIndex": "사이트맵 인덱스",
    "presets": "프리셋",
    "presetBasic": "기본 예시",
    "presetImage": "이미지 예시",
    "presetVideo": "동영상 예시",
    "presetNews": "뉴스 예시",
    "presetIndex": "사이트맵 인덱스 예시",
    "settings": "설정",
    "baseUrl": "기본 URL",
    "autoJoin": "상대 URL 자동 결합",
    "urlEntries": "URL 항목",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL 제거",
    "addUrl": "URL 추가",
    "loc": "URL",
    "lastmod": "마지막 수정",
    "changefreq": "변경 빈도",
    "priority": "우선순위",
    "images": "이미지",
    "addImage": "이미지 추가",
    "imageUrl": "이미지 URL",
    "title": "제목",
    "caption": "캡션",
    "licenseUrl": "라이선스 URL",
    "videos": "동영상",
    "addVideo": "동영상 추가",
    "thumbnailUrl": "썸네일 URL",
    "description": "설명",
    "contentUrl": "콘텐츠 URL",
    "playerUrl": "플레이어 URL",
    "duration": "재생 시간(초)",
    "publicationDate": "게시일",
    "news": "뉴스",
    "addNews": "뉴스 추가",
    "publicationName": "발행물 이름",
    "publicationLanguage": "발행물 언어",
    "keywords": "키워드",
    "sitemapEntries": "Sitemap 항목",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap 제거",
    "addSitemap": "Sitemap 추가",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "마지막 수정",
    "output": "출력",
    "download": "sitemap.xml 다운로드",
    "emptyOutput": "내보낼 내용이 없습니다."
  },
  "ru": {
    "modeUrlset": "Набор URL",
    "modeSitemapIndex": "Индекс sitemap",
    "presets": "Предустановки",
    "presetBasic": "Базовый пример",
    "presetImage": "Пример с изображениями",
    "presetVideo": "Пример с видео",
    "presetNews": "Пример с новостями",
    "presetIndex": "Пример индекса sitemap",
    "settings": "Настройки",
    "baseUrl": "Базовый URL",
    "autoJoin": "Автоматически объединять относительные URL",
    "urlEntries": "Записи URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Удалить URL",
    "addUrl": "Добавить URL",
    "loc": "URL",
    "lastmod": "Последнее изменение",
    "changefreq": "Частота изменений",
    "priority": "Приоритет",
    "images": "Изображения",
    "addImage": "Добавить изображение",
    "imageUrl": "URL изображения",
    "title": "Заголовок",
    "caption": "Подпись",
    "licenseUrl": "URL лицензии",
    "videos": "Видео",
    "addVideo": "Добавить видео",
    "thumbnailUrl": "URL миниатюры",
    "description": "Описание",
    "contentUrl": "URL контента",
    "playerUrl": "URL плеера",
    "duration": "Длительность (секунды)",
    "publicationDate": "Дата публикации",
    "news": "Новости",
    "addNews": "Добавить новость",
    "publicationName": "Название издания",
    "publicationLanguage": "Язык издания",
    "keywords": "Ключевые слова",
    "sitemapEntries": "Записи sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Удалить sitemap",
    "addSitemap": "Добавить sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Последнее изменение",
    "output": "Вывод",
    "download": "Скачать sitemap.xml",
    "emptyOutput": "Нет содержимого для экспорта."
  },
  "pt": {
    "modeUrlset": "Conjunto de URL",
    "modeSitemapIndex": "Índice de sitemaps",
    "presets": "Predefinições",
    "presetBasic": "Exemplo básico",
    "presetImage": "Exemplo de imagem",
    "presetVideo": "Exemplo de vídeo",
    "presetNews": "Exemplo de notícias",
    "presetIndex": "Exemplo de índice de sitemaps",
    "settings": "Configurações",
    "baseUrl": "URL base",
    "autoJoin": "Unir URLs relativas automaticamente",
    "urlEntries": "Entradas de URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Remover URL",
    "addUrl": "Adicionar URL",
    "loc": "URL",
    "lastmod": "Última modificação",
    "changefreq": "Frequência de mudança",
    "priority": "Prioridade",
    "images": "Imagens",
    "addImage": "Adicionar imagem",
    "imageUrl": "URL da imagem",
    "title": "Título",
    "caption": "Legenda",
    "licenseUrl": "URL da licença",
    "videos": "Vídeos",
    "addVideo": "Adicionar vídeo",
    "thumbnailUrl": "URL da miniatura",
    "description": "Descrição",
    "contentUrl": "URL do conteúdo",
    "playerUrl": "URL do player",
    "duration": "Duração (segundos)",
    "publicationDate": "Data de publicação",
    "news": "Notícias",
    "addNews": "Adicionar notícia",
    "publicationName": "Nome da publicação",
    "publicationLanguage": "Idioma da publicação",
    "keywords": "Palavras-chave",
    "sitemapEntries": "Entradas de sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Remover sitemap",
    "addSitemap": "Adicionar sitemap",
    "sitemapLoc": "URL do sitemap",
    "sitemapLastmod": "Última modificação",
    "output": "Saída",
    "download": "Baixar sitemap.xml",
    "emptyOutput": "Ainda não há conteúdo para exportar."
  },
  "ar": {
    "modeUrlset": "مجموعة عناوين URL",
    "modeSitemapIndex": "فهرس sitemap",
    "presets": "الإعدادات المسبقة",
    "presetBasic": "مثال أساسي",
    "presetImage": "مثال صور",
    "presetVideo": "مثال فيديو",
    "presetNews": "مثال أخبار",
    "presetIndex": "مثال فهرس sitemap",
    "settings": "الإعدادات",
    "baseUrl": "عنوان URL الأساسي",
    "autoJoin": "دمج عناوين URL النسبية تلقائيا",
    "urlEntries": "إدخالات URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "إزالة URL",
    "addUrl": "إضافة URL",
    "loc": "URL",
    "lastmod": "آخر تعديل",
    "changefreq": "تكرار التغيير",
    "priority": "الأولوية",
    "images": "الصور",
    "addImage": "إضافة صورة",
    "imageUrl": "URL الصورة",
    "title": "العنوان",
    "caption": "الوصف",
    "licenseUrl": "URL الترخيص",
    "videos": "الفيديوهات",
    "addVideo": "إضافة فيديو",
    "thumbnailUrl": "URL الصورة المصغرة",
    "description": "الوصف",
    "contentUrl": "URL المحتوى",
    "playerUrl": "URL المشغل",
    "duration": "المدة (ثوان)",
    "publicationDate": "تاريخ النشر",
    "news": "الأخبار",
    "addNews": "إضافة خبر",
    "publicationName": "اسم النشر",
    "publicationLanguage": "لغة النشر",
    "keywords": "الكلمات المفتاحية",
    "sitemapEntries": "إدخالات sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "إزالة sitemap",
    "addSitemap": "إضافة sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "آخر تعديل",
    "output": "المخرجات",
    "download": "تنزيل sitemap.xml",
    "emptyOutput": "لا يوجد محتوى للتصدير بعد."
  },
  "hi": {
    "modeUrlset": "URL सेट",
    "modeSitemapIndex": "Sitemap इंडेक्स",
    "presets": "प्रीसेट",
    "presetBasic": "बेसिक उदाहरण",
    "presetImage": "इमेज उदाहरण",
    "presetVideo": "वीडियो उदाहरण",
    "presetNews": "न्यूज उदाहरण",
    "presetIndex": "Sitemap इंडेक्स उदाहरण",
    "settings": "सेटिंग्स",
    "baseUrl": "बेस URL",
    "autoJoin": "रिलेटिव URL ऑटो-जोइन करें",
    "urlEntries": "URL एंट्री",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL हटाएं",
    "addUrl": "URL जोड़ें",
    "loc": "URL",
    "lastmod": "अंतिम संशोधन",
    "changefreq": "परिवर्तन आवृत्ति",
    "priority": "प्राथमिकता",
    "images": "इमेज",
    "addImage": "इमेज जोड़ें",
    "imageUrl": "इमेज URL",
    "title": "शीर्षक",
    "caption": "कैप्शन",
    "licenseUrl": "लाइसेंस URL",
    "videos": "वीडियो",
    "addVideo": "वीडियो जोड़ें",
    "thumbnailUrl": "थंबनेल URL",
    "description": "विवरण",
    "contentUrl": "कंटेंट URL",
    "playerUrl": "प्लेयर URL",
    "duration": "अवधि (सेकंड)",
    "publicationDate": "प्रकाशन तिथि",
    "news": "न्यूज",
    "addNews": "न्यूज जोड़ें",
    "publicationName": "प्रकाशन नाम",
    "publicationLanguage": "प्रकाशन भाषा",
    "keywords": "कीवर्ड",
    "sitemapEntries": "Sitemap एंट्री",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap हटाएं",
    "addSitemap": "Sitemap जोड़ें",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "अंतिम संशोधन",
    "output": "आउटपुट",
    "download": "sitemap.xml डाउनलोड करें",
    "emptyOutput": "अभी निर्यात करने के लिए कोई सामग्री नहीं है।"
  },
  "tr": {
    "modeUrlset": "URL seti",
    "modeSitemapIndex": "Sitemap dizini",
    "presets": "Ön ayarlar",
    "presetBasic": "Temel örnek",
    "presetImage": "Görsel örneği",
    "presetVideo": "Video örneği",
    "presetNews": "Haber örneği",
    "presetIndex": "Sitemap dizini örneği",
    "settings": "Ayarlar",
    "baseUrl": "Temel URL",
    "autoJoin": "Göreli URL'leri otomatik birleştir",
    "urlEntries": "URL girişleri",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL kaldır",
    "addUrl": "URL ekle",
    "loc": "URL",
    "lastmod": "Son değişiklik",
    "changefreq": "Değişim sıklığı",
    "priority": "Öncelik",
    "images": "Görseller",
    "addImage": "Görsel ekle",
    "imageUrl": "Görsel URL",
    "title": "Başlık",
    "caption": "Açıklama",
    "licenseUrl": "Lisans URL",
    "videos": "Videolar",
    "addVideo": "Video ekle",
    "thumbnailUrl": "Küçük resim URL",
    "description": "Açıklama",
    "contentUrl": "İçerik URL",
    "playerUrl": "Oynatıcı URL",
    "duration": "Süre (saniye)",
    "publicationDate": "Yayın tarihi",
    "news": "Haberler",
    "addNews": "Haber ekle",
    "publicationName": "Yayın adı",
    "publicationLanguage": "Yayın dili",
    "keywords": "Anahtar kelimeler",
    "sitemapEntries": "Sitemap girişleri",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap kaldır",
    "addSitemap": "Sitemap ekle",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "Son değişiklik",
    "output": "Çıktı",
    "download": "sitemap.xml indir",
    "emptyOutput": "Dışa aktarılacak içerik yok."
  },
  "nl": {
    "modeUrlset": "URL-set",
    "modeSitemapIndex": "Sitemapindex",
    "presets": "Voorinstellingen",
    "presetBasic": "Basisvoorbeeld",
    "presetImage": "Afbeeldingsvoorbeeld",
    "presetVideo": "Videovoorbeeld",
    "presetNews": "Nieuwsvoorbeeld",
    "presetIndex": "Sitemapindex-voorbeeld",
    "settings": "Instellingen",
    "baseUrl": "Basis-URL",
    "autoJoin": "Relatieve URL's automatisch samenvoegen",
    "urlEntries": "URL-items",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL verwijderen",
    "addUrl": "URL toevoegen",
    "loc": "URL",
    "lastmod": "Laatst gewijzigd",
    "changefreq": "Wijzigingsfrequentie",
    "priority": "Prioriteit",
    "images": "Afbeeldingen",
    "addImage": "Afbeelding toevoegen",
    "imageUrl": "Afbeelding-URL",
    "title": "Titel",
    "caption": "Bijschrift",
    "licenseUrl": "Licentie-URL",
    "videos": "Video's",
    "addVideo": "Video toevoegen",
    "thumbnailUrl": "Thumbnail-URL",
    "description": "Beschrijving",
    "contentUrl": "Content-URL",
    "playerUrl": "Player-URL",
    "duration": "Duur (seconden)",
    "publicationDate": "Publicatiedatum",
    "news": "Nieuws",
    "addNews": "Nieuws toevoegen",
    "publicationName": "Publicatienaam",
    "publicationLanguage": "Publicatietaal",
    "keywords": "Trefwoorden",
    "sitemapEntries": "Sitemap-items",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap verwijderen",
    "addSitemap": "Sitemap toevoegen",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Laatst gewijzigd",
    "output": "Uitvoer",
    "download": "sitemap.xml downloaden",
    "emptyOutput": "Nog geen inhoud om te exporteren."
  },
  "sv": {
    "modeUrlset": "URL-uppsättning",
    "modeSitemapIndex": "Sitemapindex",
    "presets": "Förinställningar",
    "presetBasic": "Grundexempel",
    "presetImage": "Bildexempel",
    "presetVideo": "Videoexempel",
    "presetNews": "Nyhetsexempel",
    "presetIndex": "Sitemapindex-exempel",
    "settings": "Inställningar",
    "baseUrl": "Bas-URL",
    "autoJoin": "Slå ihop relativa URL:er automatiskt",
    "urlEntries": "URL-poster",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Ta bort URL",
    "addUrl": "Lägg till URL",
    "loc": "URL",
    "lastmod": "Senast ändrad",
    "changefreq": "Ändringsfrekvens",
    "priority": "Prioritet",
    "images": "Bilder",
    "addImage": "Lägg till bild",
    "imageUrl": "Bild-URL",
    "title": "Titel",
    "caption": "Bildtext",
    "licenseUrl": "Licens-URL",
    "videos": "Videor",
    "addVideo": "Lägg till video",
    "thumbnailUrl": "Miniatyr-URL",
    "description": "Beskrivning",
    "contentUrl": "Innehålls-URL",
    "playerUrl": "Spelar-URL",
    "duration": "Längd (sekunder)",
    "publicationDate": "Publiceringsdatum",
    "news": "Nyheter",
    "addNews": "Lägg till nyhet",
    "publicationName": "Publikationsnamn",
    "publicationLanguage": "Publikationsspråk",
    "keywords": "Nyckelord",
    "sitemapEntries": "Sitemap-poster",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Ta bort sitemap",
    "addSitemap": "Lägg till sitemap",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Senast ändrad",
    "output": "Utdata",
    "download": "Ladda ner sitemap.xml",
    "emptyOutput": "Inget innehåll att exportera än."
  },
  "pl": {
    "modeUrlset": "Zestaw URL",
    "modeSitemapIndex": "Indeks sitemap",
    "presets": "Presety",
    "presetBasic": "Podstawowy przykład",
    "presetImage": "Przykład z obrazami",
    "presetVideo": "Przykład wideo",
    "presetNews": "Przykład newsów",
    "presetIndex": "Przykład indeksu sitemap",
    "settings": "Ustawienia",
    "baseUrl": "Bazowy URL",
    "autoJoin": "Automatycznie łącz względne URL",
    "urlEntries": "Wpisy URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Usuń URL",
    "addUrl": "Dodaj URL",
    "loc": "URL",
    "lastmod": "Ostatnia modyfikacja",
    "changefreq": "Częstotliwość zmian",
    "priority": "Priorytet",
    "images": "Obrazy",
    "addImage": "Dodaj obraz",
    "imageUrl": "URL obrazu",
    "title": "Tytuł",
    "caption": "Podpis",
    "licenseUrl": "URL licencji",
    "videos": "Wideo",
    "addVideo": "Dodaj wideo",
    "thumbnailUrl": "URL miniatury",
    "description": "Opis",
    "contentUrl": "URL treści",
    "playerUrl": "URL odtwarzacza",
    "duration": "Czas trwania (sekundy)",
    "publicationDate": "Data publikacji",
    "news": "Wiadomości",
    "addNews": "Dodaj wiadomość",
    "publicationName": "Nazwa publikacji",
    "publicationLanguage": "Język publikacji",
    "keywords": "Słowa kluczowe",
    "sitemapEntries": "Wpisy sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Usuń sitemap",
    "addSitemap": "Dodaj sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Ostatnia modyfikacja",
    "output": "Wynik",
    "download": "Pobierz sitemap.xml",
    "emptyOutput": "Brak treści do eksportu."
  },
  "vi": {
    "modeUrlset": "Bộ URL",
    "modeSitemapIndex": "Chỉ mục sitemap",
    "presets": "Mẫu",
    "presetBasic": "Ví dụ cơ bản",
    "presetImage": "Ví dụ hình ảnh",
    "presetVideo": "Ví dụ video",
    "presetNews": "Ví dụ tin tức",
    "presetIndex": "Ví dụ chỉ mục sitemap",
    "settings": "Cài đặt",
    "baseUrl": "URL cơ sở",
    "autoJoin": "Tự động ghép URL tương đối",
    "urlEntries": "Mục URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Xóa URL",
    "addUrl": "Thêm URL",
    "loc": "URL",
    "lastmod": "Cập nhật lần cuối",
    "changefreq": "Tần suất thay đổi",
    "priority": "Độ ưu tiên",
    "images": "Hình ảnh",
    "addImage": "Thêm hình ảnh",
    "imageUrl": "URL hình ảnh",
    "title": "Tiêu đề",
    "caption": "Chú thích",
    "licenseUrl": "URL giấy phép",
    "videos": "Video",
    "addVideo": "Thêm video",
    "thumbnailUrl": "URL ảnh thu nhỏ",
    "description": "Mô tả",
    "contentUrl": "URL nội dung",
    "playerUrl": "URL trình phát",
    "duration": "Thời lượng (giây)",
    "publicationDate": "Ngày xuất bản",
    "news": "Tin tức",
    "addNews": "Thêm tin",
    "publicationName": "Tên ấn phẩm",
    "publicationLanguage": "Ngôn ngữ ấn phẩm",
    "keywords": "Từ khóa",
    "sitemapEntries": "Mục sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Xóa sitemap",
    "addSitemap": "Thêm sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Cập nhật lần cuối",
    "output": "Kết quả",
    "download": "Tải sitemap.xml",
    "emptyOutput": "Chưa có nội dung để xuất."
  },
  "th": {
    "modeUrlset": "ชุด URL",
    "modeSitemapIndex": "ดัชนี sitemap",
    "presets": "พรีเซ็ต",
    "presetBasic": "ตัวอย่างพื้นฐาน",
    "presetImage": "ตัวอย่างรูปภาพ",
    "presetVideo": "ตัวอย่างวิดีโอ",
    "presetNews": "ตัวอย่างข่าว",
    "presetIndex": "ตัวอย่างดัชนี sitemap",
    "settings": "การตั้งค่า",
    "baseUrl": "URL พื้นฐาน",
    "autoJoin": "รวม URL แบบสัมพันธ์อัตโนมัติ",
    "urlEntries": "รายการ URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "ลบ URL",
    "addUrl": "เพิ่ม URL",
    "loc": "URL",
    "lastmod": "แก้ไขล่าสุด",
    "changefreq": "ความถี่การเปลี่ยนแปลง",
    "priority": "ลำดับความสำคัญ",
    "images": "รูปภาพ",
    "addImage": "เพิ่มรูปภาพ",
    "imageUrl": "URL รูปภาพ",
    "title": "ชื่อเรื่อง",
    "caption": "คำบรรยาย",
    "licenseUrl": "URL ใบอนุญาต",
    "videos": "วิดีโอ",
    "addVideo": "เพิ่มวิดีโอ",
    "thumbnailUrl": "URL ภาพย่อ",
    "description": "คำอธิบาย",
    "contentUrl": "URL เนื้อหา",
    "playerUrl": "URL ตัวเล่น",
    "duration": "ความยาว (วินาที)",
    "publicationDate": "วันที่เผยแพร่",
    "news": "ข่าว",
    "addNews": "เพิ่มข่าว",
    "publicationName": "ชื่อสิ่งพิมพ์",
    "publicationLanguage": "ภาษาสิ่งพิมพ์",
    "keywords": "คีย์เวิร์ด",
    "sitemapEntries": "รายการ sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "ลบ sitemap",
    "addSitemap": "เพิ่ม sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "แก้ไขล่าสุด",
    "output": "ผลลัพธ์",
    "download": "ดาวน์โหลด sitemap.xml",
    "emptyOutput": "ยังไม่มีเนื้อหาสำหรับส่งออก"
  },
  "id": {
    "modeUrlset": "Set URL",
    "modeSitemapIndex": "Indeks sitemap",
    "presets": "Preset",
    "presetBasic": "Contoh dasar",
    "presetImage": "Contoh gambar",
    "presetVideo": "Contoh video",
    "presetNews": "Contoh berita",
    "presetIndex": "Contoh indeks sitemap",
    "settings": "Pengaturan",
    "baseUrl": "URL dasar",
    "autoJoin": "Gabungkan URL relatif secara otomatis",
    "urlEntries": "Entri URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Hapus URL",
    "addUrl": "Tambah URL",
    "loc": "URL",
    "lastmod": "Terakhir diubah",
    "changefreq": "Frekuensi perubahan",
    "priority": "Prioritas",
    "images": "Gambar",
    "addImage": "Tambah gambar",
    "imageUrl": "URL gambar",
    "title": "Judul",
    "caption": "Keterangan",
    "licenseUrl": "URL lisensi",
    "videos": "Video",
    "addVideo": "Tambah video",
    "thumbnailUrl": "URL thumbnail",
    "description": "Deskripsi",
    "contentUrl": "URL konten",
    "playerUrl": "URL pemutar",
    "duration": "Durasi (detik)",
    "publicationDate": "Tanggal publikasi",
    "news": "Berita",
    "addNews": "Tambah berita",
    "publicationName": "Nama publikasi",
    "publicationLanguage": "Bahasa publikasi",
    "keywords": "Kata kunci",
    "sitemapEntries": "Entri sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Hapus sitemap",
    "addSitemap": "Tambah sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Terakhir diubah",
    "output": "Output",
    "download": "Unduh sitemap.xml",
    "emptyOutput": "Belum ada konten untuk diekspor."
  },
  "he": {
    "modeUrlset": "סט URL",
    "modeSitemapIndex": "אינדקס sitemap",
    "presets": "הגדרות מראש",
    "presetBasic": "דוגמה בסיסית",
    "presetImage": "דוגמת תמונה",
    "presetVideo": "דוגמת וידאו",
    "presetNews": "דוגמת חדשות",
    "presetIndex": "דוגמת אינדקס sitemap",
    "settings": "הגדרות",
    "baseUrl": "URL בסיסי",
    "autoJoin": "איחוד אוטומטי של URL יחסיים",
    "urlEntries": "רשומות URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "הסר URL",
    "addUrl": "הוסף URL",
    "loc": "URL",
    "lastmod": "שינוי אחרון",
    "changefreq": "תדירות שינוי",
    "priority": "עדיפות",
    "images": "תמונות",
    "addImage": "הוסף תמונה",
    "imageUrl": "URL תמונה",
    "title": "כותרת",
    "caption": "כיתוב",
    "licenseUrl": "URL רישיון",
    "videos": "וידאו",
    "addVideo": "הוסף וידאו",
    "thumbnailUrl": "URL תמונה ממוזערת",
    "description": "תיאור",
    "contentUrl": "URL תוכן",
    "playerUrl": "URL נגן",
    "duration": "משך (שניות)",
    "publicationDate": "תאריך פרסום",
    "news": "חדשות",
    "addNews": "הוסף חדשות",
    "publicationName": "שם הפרסום",
    "publicationLanguage": "שפת הפרסום",
    "keywords": "מילות מפתח",
    "sitemapEntries": "רשומות sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "הסר sitemap",
    "addSitemap": "הוסף sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "שינוי אחרון",
    "output": "פלט",
    "download": "הורד sitemap.xml",
    "emptyOutput": "אין תוכן לייצוא עדיין."
  },
  "ms": {
    "modeUrlset": "Set URL",
    "modeSitemapIndex": "Indeks sitemap",
    "presets": "Praset",
    "presetBasic": "Contoh asas",
    "presetImage": "Contoh imej",
    "presetVideo": "Contoh video",
    "presetNews": "Contoh berita",
    "presetIndex": "Contoh indeks sitemap",
    "settings": "Tetapan",
    "baseUrl": "URL asas",
    "autoJoin": "Gabung URL relatif secara automatik",
    "urlEntries": "Entri URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Buang URL",
    "addUrl": "Tambah URL",
    "loc": "URL",
    "lastmod": "Terakhir diubah",
    "changefreq": "Kekerapan perubahan",
    "priority": "Keutamaan",
    "images": "Imej",
    "addImage": "Tambah imej",
    "imageUrl": "URL imej",
    "title": "Tajuk",
    "caption": "Kapsyen",
    "licenseUrl": "URL lesen",
    "videos": "Video",
    "addVideo": "Tambah video",
    "thumbnailUrl": "URL imej kecil",
    "description": "Penerangan",
    "contentUrl": "URL kandungan",
    "playerUrl": "URL pemain",
    "duration": "Tempoh (saat)",
    "publicationDate": "Tarikh penerbitan",
    "news": "Berita",
    "addNews": "Tambah berita",
    "publicationName": "Nama penerbitan",
    "publicationLanguage": "Bahasa penerbitan",
    "keywords": "Kata kunci",
    "sitemapEntries": "Entri sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Buang sitemap",
    "addSitemap": "Tambah sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Terakhir diubah",
    "output": "Output",
    "download": "Muat turun sitemap.xml",
    "emptyOutput": "Belum ada kandungan untuk dieksport."
  },
  "no": {
    "modeUrlset": "URL-sett",
    "modeSitemapIndex": "Sitemapindeks",
    "presets": "Forhåndsinnstillinger",
    "presetBasic": "Grunnleggende eksempel",
    "presetImage": "Bildeeksempel",
    "presetVideo": "Videoeksempel",
    "presetNews": "Nyhetseksempel",
    "presetIndex": "Sitemapindeks-eksempel",
    "settings": "Innstillinger",
    "baseUrl": "Basis-URL",
    "autoJoin": "Slå sammen relative URL-er automatisk",
    "urlEntries": "URL-oppføringer",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Fjern URL",
    "addUrl": "Legg til URL",
    "loc": "URL",
    "lastmod": "Sist endret",
    "changefreq": "Endringsfrekvens",
    "priority": "Prioritet",
    "images": "Bilder",
    "addImage": "Legg til bilde",
    "imageUrl": "Bilde-URL",
    "title": "Tittel",
    "caption": "Bildetekst",
    "licenseUrl": "Lisens-URL",
    "videos": "Videoer",
    "addVideo": "Legg til video",
    "thumbnailUrl": "Miniatyr-URL",
    "description": "Beskrivelse",
    "contentUrl": "Innholds-URL",
    "playerUrl": "Spiller-URL",
    "duration": "Varighet (sekunder)",
    "publicationDate": "Publiseringsdato",
    "news": "Nyheter",
    "addNews": "Legg til nyhet",
    "publicationName": "Publikasjonsnavn",
    "publicationLanguage": "Publikasjonsspråk",
    "keywords": "Nøkkelord",
    "sitemapEntries": "Sitemap-oppføringer",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Fjern sitemap",
    "addSitemap": "Legg til sitemap",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Sist endret",
    "output": "Utdata",
    "download": "Last ned sitemap.xml",
    "emptyOutput": "Ingen innhold å eksportere ennå."
  }
}
</i18n>
