export const preferredMimeTypes = [
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  'video/mp4;codecs="avc1.4D401E,mp4a.40.2"',
  'video/mp4;codecs="avc1.640028,mp4a.40.2"',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
] as const

export function getSupportedMimeType(isTypeSupported?: (type: string) => boolean) {
  if (!isTypeSupported) return ''
  for (const type of preferredMimeTypes) {
    if (isTypeSupported(type)) return type
  }
  return ''
}

export function getExtensionForMimeType(mimeType: string) {
  const lower = mimeType.toLowerCase()
  if (lower.includes('webm')) return 'webm'
  if (lower.includes('mp4')) return 'mp4'
  if (lower.includes('matroska') || lower.includes('mkv')) return 'mkv'
  return 'webm'
}

export function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)
  const pad = (value: number) => String(value).padStart(2, '0')

  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  return `${pad(minutes)}:${pad(seconds)}`
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(1)} GB`
}
