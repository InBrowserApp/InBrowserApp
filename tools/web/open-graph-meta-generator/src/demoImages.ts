const demoImageUrls = import.meta.glob('./assets/*.svg', {
  eager: true,
  import: 'default',
  query: '?url&no-inline',
}) as Record<string, string>

const demoPreviewAssetUrl = demoImageUrls['./assets/open-graph-preview-demo.svg'] ?? ''

export const isDemoPreviewImageUrl = (url: string) => url.includes('open-graph-preview-demo.svg')

export const resolvePreviewImageSrc = (url: string) =>
  isDemoPreviewImageUrl(url) ? demoPreviewAssetUrl : url
