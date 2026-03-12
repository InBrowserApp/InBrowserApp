export type OgPreset = 'website' | 'article' | 'product' | 'minimal'
export type OgType = 'website' | 'article' | 'product' | 'profile'
export type TwitterCard = 'summary' | 'summary_large_image'

export type SocialImage = {
  url: string
  alt: string
  width: string
  height: string
}

export type BasicMeta = {
  title: string
  description: string
  canonicalUrl: string
  siteName: string
  locale: string
}

export type OpenGraphMeta = {
  type: OgType
  url: string
  image: SocialImage
}

export type TwitterMeta = {
  inheritFromOpenGraph: boolean
  card: TwitterCard
  site: string
  creator: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
}

export type ArticleMeta = {
  publishedTime: string
  modifiedTime: string
  author: string
  section: string
  tags: string
}

export type OgMetaGeneratorState = {
  preset: OgPreset
  showAdvanced: boolean
  basic: BasicMeta
  openGraph: OpenGraphMeta
  twitter: TwitterMeta
  article: ArticleMeta
}

export const ogTypeOptions = [
  { label: 'website', value: 'website' },
  { label: 'article', value: 'article' },
  { label: 'product', value: 'product' },
  { label: 'profile', value: 'profile' },
]

export const twitterCardOptions = [
  { label: 'summary_large_image', value: 'summary_large_image' },
  { label: 'summary', value: 'summary' },
]

const createEmptyImage = (): SocialImage => ({
  url: '',
  alt: '',
  width: '',
  height: '',
})

const createEmptyArticle = (): ArticleMeta => ({
  publishedTime: '',
  modifiedTime: '',
  author: '',
  section: '',
  tags: '',
})

export const createPresetState = (preset: OgPreset): OgMetaGeneratorState => {
  switch (preset) {
    case 'article':
      return {
        preset,
        showAdvanced: true,
        basic: {
          title: 'How to Ship Better Social Share Cards',
          description: 'A practical guide to writing meta tags that look good on social platforms.',
          canonicalUrl: 'https://example.com/blog/social-share-cards',
          siteName: 'Example Blog',
          locale: 'en_US',
        },
        openGraph: {
          type: 'article',
          url: 'https://example.com/blog/social-share-cards',
          image: {
            url: 'https://example.com/assets/open-graph-preview-demo.svg',
            alt: 'Illustration of a social media preview card on a blog post',
            width: '1200',
            height: '630',
          },
        },
        twitter: {
          inheritFromOpenGraph: true,
          card: 'summary_large_image',
          site: '@example',
          creator: '@writer',
          title: '',
          description: '',
          imageUrl: '',
          imageAlt: '',
        },
        article: {
          publishedTime: '2026-03-11T09:00:00Z',
          modifiedTime: '2026-03-11T10:30:00Z',
          author: 'Alex Chen',
          section: 'SEO',
          tags: 'open graph, twitter cards, social preview',
        },
      }
    case 'product':
      return {
        preset,
        showAdvanced: false,
        basic: {
          title: 'FocusFlow for Teams',
          description:
            'Plan work, share updates, and keep projects moving with a calmer team dashboard.',
          canonicalUrl: 'https://example.com/products/focusflow',
          siteName: 'Example Store',
          locale: 'en_US',
        },
        openGraph: {
          type: 'product',
          url: 'https://example.com/products/focusflow',
          image: {
            url: 'https://example.com/assets/open-graph-preview-demo.svg',
            alt: 'Dashboard preview for the FocusFlow product page',
            width: '1200',
            height: '630',
          },
        },
        twitter: {
          inheritFromOpenGraph: true,
          card: 'summary_large_image',
          site: '@examplestore',
          creator: '',
          title: '',
          description: '',
          imageUrl: '',
          imageAlt: '',
        },
        article: createEmptyArticle(),
      }
    case 'minimal':
      return {
        preset,
        showAdvanced: false,
        basic: {
          title: '',
          description: '',
          canonicalUrl: '',
          siteName: '',
          locale: 'en_US',
        },
        openGraph: {
          type: 'website',
          url: '',
          image: createEmptyImage(),
        },
        twitter: {
          inheritFromOpenGraph: true,
          card: 'summary_large_image',
          site: '',
          creator: '',
          title: '',
          description: '',
          imageUrl: '',
          imageAlt: '',
        },
        article: createEmptyArticle(),
      }
    case 'website':
    default:
      return {
        preset: 'website',
        showAdvanced: false,
        basic: {
          title: 'InBrowser.App',
          description:
            'Browser-based tools for developers, designers, and content teams. Private by default.',
          canonicalUrl: 'https://inbrowser.app/tools/open-graph-meta-generator',
          siteName: 'InBrowser.App',
          locale: 'en_US',
        },
        openGraph: {
          type: 'website',
          url: 'https://inbrowser.app/tools/open-graph-meta-generator',
          image: {
            url: 'https://inbrowser.app/assets/open-graph-preview-demo.svg',
            alt: 'InBrowser.App social preview card for the Open Graph meta tag generator',
            width: '1200',
            height: '630',
          },
        },
        twitter: {
          inheritFromOpenGraph: true,
          card: 'summary_large_image',
          site: '@inbrowserapp',
          creator: '',
          title: '',
          description: '',
          imageUrl: '',
          imageAlt: '',
        },
        article: createEmptyArticle(),
      }
  }
}

export const createDefaultState = (): OgMetaGeneratorState => createPresetState('website')
