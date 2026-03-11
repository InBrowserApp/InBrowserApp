export { default as icon } from '@vicons/fluent/DocumentLink16Regular'

export const toolID = 'open-graph-meta-generator'
export const path = '/tools/open-graph-meta-generator'

export const tags = [
  'open graph',
  'og',
  'twitter cards',
  'meta tags',
  'social preview',
  'seo',
  'html',
] as const

export const features = ['offline'] as const

const englishMeta = {
  name: 'Open Graph Meta Tag Generator',
  description: 'Generate Open Graph and Twitter card meta tags with a live social preview.',
}

const simplifiedChineseMeta = {
  name: 'Open Graph Meta 标签生成器',
  description: '生成 Open Graph 和 Twitter Card meta 标签，并实时预览社交分享卡片。',
}

const traditionalChineseMeta = {
  name: 'Open Graph Meta 標籤產生器',
  description: '產生 Open Graph 與 Twitter Card meta 標籤，並即時預覽社群分享卡片。',
}

export const meta = {
  en: englishMeta,
  zh: simplifiedChineseMeta,
  'zh-CN': simplifiedChineseMeta,
  'zh-TW': traditionalChineseMeta,
  'zh-HK': traditionalChineseMeta,
  es: englishMeta,
  fr: englishMeta,
  de: englishMeta,
  it: englishMeta,
  ja: englishMeta,
  ko: englishMeta,
  ru: englishMeta,
  pt: englishMeta,
  ar: englishMeta,
  hi: englishMeta,
  tr: englishMeta,
  nl: englishMeta,
  sv: englishMeta,
  pl: englishMeta,
  vi: englishMeta,
  th: englishMeta,
  id: englishMeta,
  he: englishMeta,
  ms: englishMeta,
  no: englishMeta,
}
