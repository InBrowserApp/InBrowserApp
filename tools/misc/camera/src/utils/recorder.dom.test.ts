import { describe, expect, it } from 'vitest'
import {
  getExtensionForMimeType,
  getSupportedVideoMimeType,
  formatDuration,
  formatFileSize,
} from './recorder'

describe('camera recorder utils', () => {
  it('picks the first supported video mime type', () => {
    const isSupported = (type: string) =>
      type === 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"' || type === 'video/webm'
    expect(getSupportedVideoMimeType(isSupported)).toBe('video/mp4;codecs="avc1.42E01E,mp4a.40.2"')
  })

  it('returns empty when no video mime type is supported', () => {
    const isSupported = (_type: string) => false
    expect(getSupportedVideoMimeType(isSupported)).toBe('')
  })

  it('maps mime type to extension', () => {
    expect(getExtensionForMimeType('image/jpeg')).toBe('jpg')
    expect(getExtensionForMimeType('video/webm')).toBe('webm')
  })

  it('formats duration and file size', () => {
    expect(formatDuration(0)).toBe('00:00')
    expect(formatDuration(61000)).toBe('01:01')
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1.0 KB')
  })
})
