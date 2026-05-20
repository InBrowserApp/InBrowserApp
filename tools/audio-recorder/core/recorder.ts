const preferredAudioMimeTypes = [
  'audio/mp4;codecs="mp4a.40.2"',
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
] as const

const audioExtensionPattern = /\.(?:m4a|mp4|ogg|webm|wav)$/i

type AudioMimeTypeSupport = (mimeType: string) => boolean

function getSupportedAudioMimeType(
  isTypeSupported?: AudioMimeTypeSupport
): string {
  if (!isTypeSupported) {
    return ""
  }

  return (
    preferredAudioMimeTypes.find((mimeType) => isTypeSupported(mimeType)) ?? ""
  )
}

function getAudioExtensionForMimeType(mimeType: string): string {
  const lowerMimeType = mimeType.toLowerCase()

  if (lowerMimeType.includes("webm")) {
    return "webm"
  }

  if (lowerMimeType.includes("ogg")) {
    return "ogg"
  }

  if (
    lowerMimeType.includes("mp4") ||
    lowerMimeType.includes("m4a") ||
    lowerMimeType.includes("aac")
  ) {
    return "m4a"
  }

  if (lowerMimeType.includes("wav") || lowerMimeType.includes("wave")) {
    return "wav"
  }

  return "webm"
}

function formatRecordingDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)
  const pad = (value: number) => String(value).padStart(2, "0")

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${pad(minutes)}:${pad(seconds)}`
}

function formatRecordingFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B"
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  const kibibytes = bytes / 1024

  if (kibibytes < 1024) {
    return `${kibibytes.toFixed(1)} KB`
  }

  const mebibytes = kibibytes / 1024

  if (mebibytes < 1024) {
    return `${mebibytes.toFixed(1)} MB`
  }

  return `${(mebibytes / 1024).toFixed(1)} GB`
}

function buildDefaultRecordingName(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0")
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `recording-${year}${month}${day}-${hours}${minutes}${seconds}`
}

function sanitizeRecordingBaseName(
  value: string,
  fallback = "recording"
): string {
  const normalized = value
    .trim()
    .replace(audioExtensionPattern, "")
    .replaceAll(/[<>:"/\\|?*]/g, "-")
    .replaceAll(/\p{Cc}/gu, "-")
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-")
    .replace(/[.\s-]+$/g, "")
    .replace(/^[.\s-]+/g, "")

  if (normalized.length === 0) {
    return fallback
  }

  return normalized.slice(0, 120)
}

function buildRecordingDownloadName(
  value: string,
  mimeType: string,
  fallback = "recording"
): string {
  const baseName = sanitizeRecordingBaseName(value, fallback)
  const extension = getAudioExtensionForMimeType(mimeType)

  return `${baseName}.${extension}`
}

function isPermissionDeniedError(error: unknown): boolean {
  const name =
    error instanceof DOMException || error instanceof Error ? error.name : ""

  return name === "NotAllowedError" || name === "PermissionDeniedError"
}

export {
  buildDefaultRecordingName,
  buildRecordingDownloadName,
  formatRecordingDuration,
  formatRecordingFileSize,
  getAudioExtensionForMimeType,
  getSupportedAudioMimeType,
  isPermissionDeniedError,
  sanitizeRecordingBaseName,
}
