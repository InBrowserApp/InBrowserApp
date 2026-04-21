const DEFAULT_MEDIA_TYPE = "text/plain"
const DEFAULT_CHARSET = "charset=US-ASCII"
const MAX_TEXT_PREVIEW_LENGTH = 2000

type PreviewKind = "image" | "audio" | "video" | "text" | null

type ParsedDataUri = Readonly<{
  mimeType: string
  mediaType: string
  isBase64: boolean
  data: string
}>

type DataUriPreviewResult =
  | Readonly<{
      state: "empty"
    }>
  | Readonly<{
      state: "invalid-data-uri"
    }>
  | Readonly<{
      state: "decoded"
      mimeType: string
      mediaType: string
      isBase64: boolean
      size: number
      bytes: Uint8Array
      previewKind: PreviewKind
      textPreview: string
      isPreviewTruncated: boolean
    }>

function parseDataUriPreview(input: string): DataUriPreviewResult {
  const trimmedInput = input.trim()

  if (trimmedInput.length === 0) {
    return { state: "empty" }
  }

  try {
    const parsed = parseDataUri(trimmedInput)
    const bytes = decodeDataUri(parsed)
    const previewKind = getPreviewKind(parsed.mediaType)
    const { textPreview, isPreviewTruncated } = getTextPreview(
      bytes,
      previewKind,
      parsed.mimeType
    )

    return {
      state: "decoded",
      mimeType: parsed.mimeType,
      mediaType: parsed.mediaType,
      isBase64: parsed.isBase64,
      size: bytes.byteLength,
      bytes,
      previewKind,
      textPreview,
      isPreviewTruncated,
    }
  } catch {
    return { state: "invalid-data-uri" }
  }
}

function parseDataUri(input: string): ParsedDataUri {
  if (!input.startsWith("data:")) {
    throw new Error("Invalid Data URI")
  }

  const commaIndex = input.indexOf(",")

  if (commaIndex === -1) {
    throw new Error("Invalid Data URI")
  }

  const metadata = input.slice(5, commaIndex)
  const data = input.slice(commaIndex + 1)
  const segments = metadata.split(";")
  const [firstSegment = ""] = segments
  let mediaType = firstSegment.trim()
  const trailingSegments = segments.slice(1).filter(Boolean)

  let isBase64 = trailingSegments.some(
    (segment) => segment.toLowerCase() === "base64"
  )

  if (mediaType.toLowerCase() === "base64") {
    mediaType = ""
    isBase64 = true
  }

  const parameters = trailingSegments.filter(
    (segment) => segment.toLowerCase() !== "base64"
  )
  const hasExplicitMediaType = mediaType.length > 0
  const resolvedMediaType = hasExplicitMediaType
    ? mediaType
    : DEFAULT_MEDIA_TYPE
  const hasCharset = parameters.some((segment) =>
    segment.toLowerCase().startsWith("charset=")
  )

  if (!hasExplicitMediaType && !hasCharset) {
    parameters.unshift(DEFAULT_CHARSET)
  }

  return {
    mimeType:
      parameters.length > 0
        ? `${resolvedMediaType};${parameters.join(";")}`
        : resolvedMediaType,
    mediaType: resolvedMediaType.toLowerCase(),
    isBase64,
    data,
  }
}

function decodeDataUri(parsed: ParsedDataUri): Uint8Array {
  if (parsed.isBase64) {
    return decodeBase64(parsed.data)
  }

  return decodePercentEncodedBytes(parsed.data)
}

function getPreviewKind(mediaType: string): PreviewKind {
  if (mediaType.startsWith("image/")) {
    return "image"
  }

  if (mediaType.startsWith("audio/")) {
    return "audio"
  }

  if (mediaType.startsWith("video/")) {
    return "video"
  }

  if (isTextLikeMediaType(mediaType)) {
    return "text"
  }

  return null
}

function deriveDecodedFileName(mimeType: string) {
  const extension = getExtensionFromMimeType(mimeType)
  return extension ? `data.${extension}` : "data.bin"
}

function decodeBase64(value: string) {
  const normalized = value.replace(/\s+/g, "")
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function decodePercentEncodedBytes(value: string) {
  const bytes: number[] = []
  const encoder = new TextEncoder()

  for (let index = 0; index < value.length; ) {
    if (value[index] === "%") {
      const hex = value.slice(index + 1, index + 3)

      if (!/^[\da-fA-F]{2}$/.test(hex)) {
        throw new Error("Invalid percent-encoding")
      }

      bytes.push(Number.parseInt(hex, 16))
      index += 3
      continue
    }

    const codePoint = value.codePointAt(index)!
    const chunk = String.fromCodePoint(codePoint)
    bytes.push(...encoder.encode(chunk))
    index += chunk.length
  }

  return new Uint8Array(bytes)
}

function getTextPreview(
  bytes: Uint8Array,
  previewKind: PreviewKind,
  mimeType: string
) {
  if (previewKind !== "text") {
    return {
      textPreview: "",
      isPreviewTruncated: false,
    }
  }

  const decoded = decodeTextBytes(bytes, mimeType)
  const isPreviewTruncated = decoded.length > MAX_TEXT_PREVIEW_LENGTH

  return {
    textPreview: isPreviewTruncated
      ? decoded.slice(0, MAX_TEXT_PREVIEW_LENGTH) + "..."
      : decoded,
    isPreviewTruncated,
  }
}

function decodeTextBytes(bytes: Uint8Array, mimeType: string) {
  const charset = getCharsetFromMimeType(mimeType)

  if (charset) {
    try {
      return new TextDecoder(charset).decode(bytes)
    } catch {
      return new TextDecoder().decode(bytes)
    }
  }

  return new TextDecoder().decode(bytes)
}

function getCharsetFromMimeType(mimeType: string) {
  const parameters = mimeType.split(";").slice(1)

  for (const parameter of parameters) {
    const [name = "", ...rest] = parameter.split("=")

    if (name.trim().toLowerCase() !== "charset") {
      continue
    }

    const value = rest.join("=").trim().replace(/^"|"$/g, "")
    return value.length > 0 ? value : null
  }

  return null
}

function isTextLikeMediaType(mediaType: string) {
  if (mediaType.startsWith("text/")) {
    return true
  }

  return (
    mediaType === "application/json" ||
    mediaType === "application/javascript" ||
    mediaType === "application/xml" ||
    mediaType === "application/x-www-form-urlencoded" ||
    mediaType.endsWith("+json") ||
    mediaType.endsWith("+xml")
  )
}

function getExtensionFromMimeType(mimeType: string) {
  const [mediaTypePrefix = ""] = mimeType.split(";")
  const mediaType = mediaTypePrefix.trim().toLowerCase()
  const knownExtensions: Readonly<Record<string, string>> = {
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/csv": "csv",
    "text/javascript": "js",
    "application/javascript": "js",
    "application/json": "json",
    "application/xml": "xml",
    "application/pdf": "pdf",
    "application/zip": "zip",
    "application/x-www-form-urlencoded": "txt",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "video/mp4": "mp4",
    "video/webm": "webm",
  }

  const knownExtension = knownExtensions[mediaType]

  if (knownExtension) {
    return knownExtension
  }

  const subtype = mediaType.split("/")[1]

  if (!subtype) {
    return null
  }

  if (subtype.endsWith("+json")) {
    return "json"
  }

  if (subtype.endsWith("+xml")) {
    return "xml"
  }

  return subtype
    .replace(/^x-/, "")
    .replace(/^vnd\.[^.]+\./, "")
    .replace(/[^a-z0-9]+/g, "")
}

export {
  deriveDecodedFileName,
  decodeDataUri,
  getPreviewKind,
  parseDataUri,
  parseDataUriPreview,
  type DataUriPreviewResult,
}
