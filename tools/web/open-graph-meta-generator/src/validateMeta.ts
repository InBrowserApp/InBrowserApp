import { resolveEffectiveMeta } from './meta'
import type { OgMetaGeneratorState } from './state'

export type DiagnosticLevel = 'error' | 'warning' | 'info'

export type Diagnostic = {
  id: string
  level: DiagnosticLevel
  message: string
}

const isAbsoluteHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const isPositiveInteger = (value: string) => {
  if (!value) return true
  return /^\d+$/.test(value) && Number(value) > 0
}

const isValidDateTime = (value: string) => {
  if (!value) return true
  return !Number.isNaN(Date.parse(value))
}

export const validateMeta = (state: OgMetaGeneratorState): Diagnostic[] => {
  const effective = resolveEffectiveMeta(state)
  const diagnostics: Diagnostic[] = []

  if (!effective.title) {
    diagnostics.push({ id: 'missing-title', level: 'error', message: 'Add a page title.' })
  } else if (effective.title.length > 70) {
    diagnostics.push({
      id: 'title-length',
      level: 'warning',
      message: 'Titles over about 70 characters may be truncated in social previews.',
    })
  }

  if (!effective.description) {
    diagnostics.push({
      id: 'missing-description',
      level: 'warning',
      message: 'Add a description so the preview has supporting context.',
    })
  } else if (effective.description.length > 200) {
    diagnostics.push({
      id: 'description-length',
      level: 'warning',
      message: 'Descriptions over about 200 characters may be truncated.',
    })
  }

  if (!effective.canonicalUrl) {
    diagnostics.push({
      id: 'missing-canonical',
      level: 'warning',
      message: 'Add a canonical URL so the preview points to one absolute page URL.',
    })
  } else if (!isAbsoluteHttpUrl(effective.canonicalUrl)) {
    diagnostics.push({
      id: 'invalid-canonical',
      level: 'error',
      message: 'Canonical URL must be an absolute http:// or https:// URL.',
    })
  }

  if (effective.ogUrl && !isAbsoluteHttpUrl(effective.ogUrl)) {
    diagnostics.push({
      id: 'invalid-og-url',
      level: 'error',
      message: 'Open Graph URL must be an absolute http:// or https:// URL.',
    })
  }

  if (!effective.imageUrl) {
    diagnostics.push({
      id: 'missing-image',
      level: 'warning',
      message: 'Add an image URL to improve large social previews.',
    })
  } else if (!isAbsoluteHttpUrl(effective.imageUrl)) {
    diagnostics.push({
      id: 'invalid-image',
      level: 'error',
      message: 'Image URL must be an absolute http:// or https:// URL.',
    })
  }

  if (effective.imageUrl && !effective.imageAlt) {
    diagnostics.push({
      id: 'missing-image-alt',
      level: 'info',
      message: 'Consider adding image alt text for accessibility and richer previews.',
    })
  }

  if (!isPositiveInteger(effective.imageWidth) || !isPositiveInteger(effective.imageHeight)) {
    diagnostics.push({
      id: 'invalid-image-size',
      level: 'warning',
      message: 'Image width and height should be positive integers when provided.',
    })
  }

  if (effective.twitterSite && !effective.twitterSite.startsWith('@')) {
    diagnostics.push({
      id: 'twitter-site-format',
      level: 'info',
      message: 'Twitter site handles usually start with @.',
    })
  }

  if (effective.twitterCreator && !effective.twitterCreator.startsWith('@')) {
    diagnostics.push({
      id: 'twitter-creator-format',
      level: 'info',
      message: 'Twitter creator handles usually start with @.',
    })
  }

  if (effective.ogType === 'article' && !isValidDateTime(effective.articlePublishedTime)) {
    diagnostics.push({
      id: 'invalid-published-time',
      level: 'warning',
      message: 'Published time should be a valid ISO date or datetime.',
    })
  }

  if (effective.ogType === 'article' && !isValidDateTime(effective.articleModifiedTime)) {
    diagnostics.push({
      id: 'invalid-modified-time',
      level: 'warning',
      message: 'Modified time should be a valid ISO date or datetime.',
    })
  }

  return diagnostics
}
