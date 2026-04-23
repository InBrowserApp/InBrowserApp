import {
  MIME_TYPE_CATEGORIES,
  type MimeTypeCategory,
  type MimeTypeCategoryLabel,
} from "./core/mime-type-lookup"

type MimeTypeLookupLocaleMessages = Readonly<{
  searchPlaceholder: string
  all: string
  previousPage: string
  nextPage: string
  mimeType: string
  extensions: string
  category: string
  source: string
  compressible: string
  charset: string
  yes: string
  no: string
  application: string
  audio: string
  font: string
  image: string
  message: string
  model: string
  multipart: string
  text: string
  video: string
  unknown: string
}>

type MimeTypeLookupMessages = MimeTypeLookupLocaleMessages &
  Readonly<{
    meta: {
      name: string
      description: string
    }
  }>

function getCategoryLabel(
  category: MimeTypeCategoryLabel,
  messages: MimeTypeLookupMessages
) {
  if (category === "application") return messages.application
  if (category === "audio") return messages.audio
  if (category === "font") return messages.font
  if (category === "image") return messages.image
  if (category === "message") return messages.message
  if (category === "model") return messages.model
  if (category === "multipart") return messages.multipart
  if (category === "text") return messages.text
  if (category === "video") return messages.video
  return messages.unknown
}

function getCategoryVariant(category: MimeTypeCategoryLabel) {
  if (
    category === "application" ||
    category === "message" ||
    category === "text"
  ) {
    return "secondary"
  }

  if (category === "image") {
    return "default"
  }

  if (category === "font" || category === "video") {
    return "outline"
  }

  if (category === "unknown") {
    return "destructive"
  }

  return "secondary"
}

function formatCount(value: number, language: string) {
  return new Intl.NumberFormat(language).format(value)
}

function formatRangeSummary(
  start: number,
  end: number,
  total: number,
  language: string
) {
  const formatNumber = new Intl.NumberFormat(language).format

  return `${formatNumber(start)}-${formatNumber(end)} / ${formatNumber(total)}`
}

function formatExtensions(extensions: readonly string[]) {
  return extensions.join(", ")
}

export {
  MIME_TYPE_CATEGORIES,
  formatCount,
  formatExtensions,
  formatRangeSummary,
  getCategoryLabel,
  getCategoryVariant,
}
export type {
  MimeTypeCategory,
  MimeTypeLookupLocaleMessages,
  MimeTypeLookupMessages,
}
